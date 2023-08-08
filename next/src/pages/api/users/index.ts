import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { customGetRepository } from '@/lib/orm/data-source';
import { User } from '@/lib/orm/entity/User';
import { authenticateUser } from '@/modules/homeChart/pages/middleware/authAdminMiddleware';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(authenticateUser, async (req, res) => {
  const usersRepo = await customGetRepository(User);

  const query = usersRepo
    .createQueryBuilder('users')
    .leftJoinAndSelect(
      'users.organizationMemberships',
      'organizationMemberships',
    )
    .leftJoinAndSelect('organizationMemberships.organization', 'organization')
    .leftJoinAndSelect('organization.datasetAccess', 'datasetAccess')
    .leftJoinAndSelect('datasetAccess.dataset', 'dataset')
    .addOrderBy('users.firstName', 'ASC');

  const users = await query.getMany();

  if (users) {
    return res.status(200).json(users);
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
