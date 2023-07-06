import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { customGetRepository } from '@/lib/orm/data-source';
import { Record } from '@/lib/orm/entity/Record';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  // TODO fix issue with skipped records
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const recordsRepo = await customGetRepository(Record);
  const userId = session.user.id;

  const query = recordsRepo
    .createQueryBuilder('record')
    .leftJoinAndSelect('record.dataChecks', 'dataCheck')
    .where('dataCheck.user.id IS NULL OR dataCheck.user.id != :userId', {
      userId,
    });

  const total = await query.getCount();

  const recordsWithoutUserCheck = await query.skip(skip).take(limit).getMany();

  res.status(200).json({
    data: recordsWithoutUserCheck,
    total,
    page,
    limit,
  });
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
