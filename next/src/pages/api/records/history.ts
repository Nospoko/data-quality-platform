import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { customGetRepository } from '@/lib/orm/data-source';
import { DataCheck } from '@/lib/orm/entity/DataCheck';
import { HistoryData } from '@/types/common';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;

  const dataCheckRepo = await customGetRepository(DataCheck);
  const userId = session.user.id;

  const query = dataCheckRepo
    .createQueryBuilder('dataCheck')
    .leftJoin('dataCheck.user', 'user')
    .leftJoinAndSelect('dataCheck.record', 'record')
    .where('user_id = :userId', { userId });

  const total = await query.getCount();

  const usersDataChecks = await query.skip(skip).take(limit).getMany();

  res.status(200).json({
    data: usersDataChecks as HistoryData[],
    total,
    limit,
  });
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
