import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { customGetRepository } from '@/lib/orm/data-source';
import { User, UserRole } from '@/lib/orm/entity/User';
import { authenticateUser } from '@/modules/admin/pages/middleware/authAdminMiddleware';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const { userId } = req.query;

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

  if (userId) {
    query.andWhere('users.id = :userId', { userId });

    const user = await query.getOne();

    if (user) {
      return res.status(200).json(user);
    }

    if (!user) {
      return res.status(404).json({ error: 'User is not found.' });
    }
  }

  const users = await query.getMany();

  if (users) {
    return res.status(200).json(users);
  }
});

router.patch(authenticateUser, async (req, res) => {
  const { userId, role } = req.body;

  const userRepo = await customGetRepository(User);
  const foundUser = await userRepo.findOne({
    where: { id: userId },
    relations: ['organizationMemberships'],
  });

  if (!foundUser) {
    return res.status(404).json({ error: 'User is not found.' });
  }

  try {
    if (role) {
      foundUser.role = role;
    } else {
      foundUser.role =
        foundUser.organizationMemberships.length > 0
          ? UserRole.MEMBER
          : UserRole.GUEST;
    }

    await userRepo.save(foundUser);

    return res.status(200).json({ message: 'User name updated successfully.' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while updating the user name.' });
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
