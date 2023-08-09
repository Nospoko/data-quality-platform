import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { In } from 'typeorm';

import { customGetRepository } from '@/lib/orm/data-source';
import { Organization } from '@/lib/orm/entity/Organization';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { User, UserRole } from '@/lib/orm/entity/User';
import { authenticateUser } from '@/modules/adminPage/pages/middleware/authAdminMiddleware';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(authenticateUser, async (req, res) => {
  const { userId, organizationIds } = req.body;

  if (!organizationIds.length || !userId) {
    return res
      .status(400)
      .json({ error: 'Organization IDs and User ID are required.' });
  }

  const userRepo = await customGetRepository(User);
  const organizationRepo = await customGetRepository(Organization);
  const membershipRepo = await customGetRepository(OrganizationMembership);

  const allOrganizations = await organizationRepo.find({
    where: { id: In(organizationIds) },
  });

  if (allOrganizations.length !== organizationIds.length) {
    return res
      .status(404)
      .json({ error: 'Organization(s) is(are) not found.' });
  }

  const foundUser = await userRepo.findOne({ where: { id: userId } });

  if (!foundUser) {
    return res.status(404).json({ error: 'User is not found.' });
  }

  const existingMemberships = await membershipRepo.findOne({
    where: {
      user: { id: userId },
      organization: { id: In(organizationIds) },
    },
  });

  if (existingMemberships) {
    return res.status(409).json({
      error: 'Organization membership already exists for this user.',
    });
  }

  const newOrganizationMemberships = organizationIds.map((orgId) => ({
    organization: orgId,
    user: userId,
  }));

  const createdMemberships = await membershipRepo.insert(
    newOrganizationMemberships,
  );

  if (createdMemberships.generatedMaps.length > 0) {
    if (foundUser.role === UserRole.GUEST) {
      foundUser.role = UserRole.MEMBER;

      await userRepo.save(foundUser);
    }

    return res.status(201).json(createdMemberships);
  } else {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.delete(authenticateUser, async (req, res) => {
  const { userId, organizationId } = req.query;

  if (!organizationId || !userId) {
    return res
      .status(400)
      .json({ error: 'Organization ID are User ID are required.' });
  }

  const membershipRepo = await customGetRepository(OrganizationMembership);
  const userRepo = await customGetRepository(User);

  const foundUser = await userRepo.findOne({ where: { id: userId as string } });

  if (!foundUser) {
    return res.status(404).json({ error: 'User is not found.' });
  }

  await membershipRepo
    .createQueryBuilder()
    .delete()
    .where('user.id = :userId', { userId: userId as string })
    .andWhere('organization.id = :organizationId', {
      organizationId: organizationId as string,
    })
    .execute();

  const otherMemberships = await membershipRepo.find({
    where: { user: { id: foundUser.id } },
  });

  if (otherMemberships.length === 0 && foundUser.role === UserRole.MEMBER) {
    foundUser.role = UserRole.GUEST;

    await userRepo.save(foundUser);
  }

  return res.status(204).end();
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
