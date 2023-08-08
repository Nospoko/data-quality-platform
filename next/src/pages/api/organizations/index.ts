import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { In } from 'typeorm';

import { customGetRepository } from '@/lib/orm/data-source';
import { DatasetAccess } from '@/lib/orm/entity/DatasetAccess';
import { Organization } from '@/lib/orm/entity/Organization';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { User, UserRole } from '@/lib/orm/entity/User';
import { authenticateUser } from '@/modules/homeChart/pages/middleware/authAdminMiddleware';
import { OrganizationType } from '@/types/common';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(authenticateUser, async (req, res) => {
  try {
    const organizationRepo = await customGetRepository(Organization);

    const queryNames = req.query['names[]'];
    const names = Array.isArray(queryNames) ? queryNames : [queryNames];
    const onlyWithMembers = req.query.onlyWithMembers === 'true';

    const query = organizationRepo
      .createQueryBuilder('organization')
      .leftJoinAndSelect(
        'organization.organizationMemberships',
        'organizationMembership',
      )
      .leftJoinAndSelect('organization.datasetAccess', 'datasetAccess')
      .leftJoinAndSelect('datasetAccess.dataset', 'dataset')
      .leftJoinAndSelect('organizationMembership.user', 'user')
      .orderBy('organization.name', 'ASC');

    if (queryNames) {
      query.andWhere('organization.name IN (:...names)', { names });
    }

    if (onlyWithMembers) {
      query.andWhere('organizationMembership.id IS NOT NULL');
    }

    const total = await query.getCount();

    const organizations = await query.getMany();

    res.status(200).json({
      data: organizations as OrganizationType[],
      total,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(authenticateUser, async (req, res) => {
  const { name, userIds, datasetIds } = req.body;

  const organizationRepo = await customGetRepository(Organization);
  const existingNameOrganization = await organizationRepo.findOne({
    where: { name },
  });

  if (existingNameOrganization) {
    return res.status(409).json({
      error: 'An organization with the same name already exists.',
    });
  }

  const newOrganization = organizationRepo.create({ name });
  const savedOrg = await organizationRepo.save(newOrganization);

  // add users to Organization
  if (userIds && userIds.length > 0) {
    const membershipRepo = await customGetRepository(OrganizationMembership);
    const usersRepo = await customGetRepository(User);
    const existedUsers = await usersRepo.find({ where: { id: In(userIds) } });

    const usersToUpdate = existedUsers.reduce((acc, data) => {
      if (data.role === UserRole.GUEST) {
        acc.push({ ...data, role: UserRole.MEMBER });
      }
      return acc;
    }, [] as User[]);

    await usersRepo.save(usersToUpdate);

    const newMembership = existedUsers.map((user) =>
      membershipRepo.create({
        organization: savedOrg,
        user,
      }),
    );
    await membershipRepo.save(newMembership);
  }

  //set dataset accesses for Organization
  if (datasetIds && datasetIds.length > 0) {
    const datasetAccessRepo = await customGetRepository(DatasetAccess);
    const newAccesses = datasetIds.map((datasetId) =>
      datasetAccessRepo.create({
        organization: savedOrg,
        dataset: { id: datasetId },
      }),
    );
    await datasetAccessRepo.save(newAccesses);
  }

  if (savedOrg) {
    return res.status(201).json(savedOrg);
  }
});

router.patch(authenticateUser, async (req, res) => {
  const { id, newName, userIds, datasetIds } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Organization ID is required.' });
  }

  const organizationRepo = await customGetRepository(Organization);
  const existedOrganization = await organizationRepo.findOne({ where: { id } });

  if (newName) {
    const organizationWithSameName = await organizationRepo.findOne({
      where: { name: newName },
    });

    if (organizationWithSameName) {
      return res.status(409).json({
        error: 'An organization with the same name already exists.',
      });
    }

    if (!existedOrganization) {
      return res.status(404).json({ error: 'Organization not found.' });
    }

    existedOrganization.name = newName;

    const changedOrganization = await organizationRepo.save(
      existedOrganization,
    );

    if (changedOrganization) {
      return res.status(200).json(changedOrganization);
    }
  }

  if (userIds && userIds.length > 0) {
    const membershipRepo = await customGetRepository(OrganizationMembership);
    const usersRepo = await customGetRepository(User);
    const existedUsers = await usersRepo.find({ where: { id: In(userIds) } });

    const usersToUpdate = existedUsers.reduce((acc, data) => {
      if (data.role === UserRole.GUEST) {
        acc.push({ ...data, role: UserRole.MEMBER });
      }
      return acc;
    }, [] as User[]);

    await usersRepo.save(usersToUpdate);

    const newMembership = existedUsers.map((user) =>
      membershipRepo.create({
        organization: { id },
        user,
      }),
    );
    await membershipRepo.save(newMembership);

    return res
      .status(200)
      .json({ message: 'Users added and roles updated successfully.' });
  }

  if (datasetIds && datasetIds.length > 0) {
    const datasetAccessRepo = await customGetRepository(DatasetAccess);
    const newAccesses = datasetIds.map((datasetId) =>
      datasetAccessRepo.create({
        organization: { id },
        dataset: { id: datasetId },
      }),
    );
    await datasetAccessRepo.save(newAccesses);

    return res
      .status(200)
      .json({ message: 'Dataset Access added successfully.' });
  }
});

router.delete(authenticateUser, async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Organization ID is required.' });
  }

  const organizationRepo = await customGetRepository(Organization);
  const membershipRepo = await customGetRepository(OrganizationMembership);
  const datasetAccessRepo = await customGetRepository(DatasetAccess);
  const userRepo = await customGetRepository(User);

  const foundOrganization = await organizationRepo.findOne({
    where: { id: id as string },
    relations: ['organizationMemberships', 'organizationMemberships.user'],
  });

  if (!foundOrganization) {
    return res.status(404).json({ error: 'Organization not found.' });
  }

  const userIds = foundOrganization.organizationMemberships.map(
    (membership) => membership.user.id,
  );

  // remove records form junction tables
  await membershipRepo.delete({
    organization: { id: id as string },
  });
  await datasetAccessRepo.delete({
    organization: { id: id as string },
  });

  const deletedOrganization = await organizationRepo.remove(foundOrganization);

  // Set the user's role as guest if they are not an admin and are not part of any organization.
  if (deletedOrganization) {
    const userToUpdate = await userRepo.find({
      where: {
        id: In(userIds),
        role: UserRole.MEMBER,
        organizationMemberships: [],
      },
    });
    const updatedUsers = userToUpdate.map((user) => ({
      ...user,
      role: UserRole.GUEST,
    }));

    await userRepo.save(updatedUsers);
  }
  return res.status(204).end();
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
