import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { customGetRepository } from '@/lib/orm/data-source';
import { Organization } from '@/lib/orm/entity/Organization';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { authenticateUser } from '@/modules/homeChart/pages/middleware/authAdminMiddleware';
import { OrganizationType } from '@/types/common';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Code for pagination is commented, don't delete them
router.get(authenticateUser, async (req, res) => {
  const onlyNames = req.query.onlyNames === 'true';

  const organizationRepo = await customGetRepository(Organization);

  if (onlyNames) {
    const query = organizationRepo.createQueryBuilder('organization');

    const organizationNames = await query.select('organization.name').getMany();
    const names = organizationNames.map((org) => org.name);

    return res.status(200).json(names);
  }

  // const limit = Number(req.query.limit) || 10;
  // const lastId = req.query.lastId;
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
    // .where('organization.id > :lastId', {
    //   lastId: lastId || '00000000-0000-0000-0000-000000000000',
    // })
    .orderBy('organization.id', 'ASC');

  if (queryNames) {
    query.andWhere('organization.name IN (:...names)', { names });
  }

  if (onlyWithMembers) {
    query.andWhere('organizationMembership.id IS NOT NULL');
  }

  const total = await query.getCount();

  const organizations = await query.getMany();

  // const organizations = await query.take(limit + 1).getMany();

  // const hasNextPage = organizations.length > limit;
  // if (hasNextPage) {
  //   organizations.pop();
  // }

  res.status(200).json({
    data: organizations as OrganizationType[],
    total,
    // hasNextPage,
  });
});

router.post(authenticateUser, async (req, res) => {
  const { name } = req.body;

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
  const result = await organizationRepo.save(newOrganization);

  if (result) {
    return res.status(201).json(result);
  }
});

router.patch(authenticateUser, async (req, res) => {
  const { id, newName } = req.body;

  if (!id || !newName || !newName.trim()) {
    return res
      .status(400)
      .json({ error: 'Organization ID and Name are required.' });
  }

  const organizationRepo = await customGetRepository(Organization);
  const existingNameOrganization = await organizationRepo.findOne({
    where: { name: newName },
  });

  if (existingNameOrganization) {
    return res.status(409).json({
      error: 'An organization with the same name already exists.',
    });
  }

  const foundOrganization = await organizationRepo.findOne({ where: { id } });

  if (!foundOrganization) {
    return res.status(404).json({ error: 'Organization not found.' });
  }

  foundOrganization.name = newName;

  const changedOrganization = await organizationRepo.save(foundOrganization);

  if (changedOrganization) {
    return res.status(200).json(changedOrganization);
  }
});

router.delete(authenticateUser, async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Organization ID is required.' });
  }

  const organizationRepo = await customGetRepository(Organization);
  const membershipRepo = await customGetRepository(OrganizationMembership);
  const foundOrganization = await organizationRepo.findOne({
    where: { id: id as string },
  });

  if (!foundOrganization) {
    return res.status(404).json({ error: 'Organization not found.' });
  }

  await membershipRepo.delete({
    organization: { id: id as string },
  });

  const deletedOrganization = await organizationRepo.remove(foundOrganization);

  if (deletedOrganization) {
    return res.status(204);
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
