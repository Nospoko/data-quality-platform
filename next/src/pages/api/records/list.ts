import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { customGetRepository } from '@/lib/orm/data-source';
import { DataCheck } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }
  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;

  const recordsRepo = await customGetRepository(Record);
  const userId = session.user.id;

  const query = recordsRepo
    .createQueryBuilder('record')
    .leftJoinAndSelect('record.dataChecks', 'dataCheck')
    .where(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select('dataCheck_sub.id')
          .from(DataCheck, 'dataCheck_sub')
          .where('dataCheck_sub.record_id = record.index')
          .andWhere('dataCheck_sub.user_id = :userId')
          .getQuery();
        return 'NOT EXISTS (' + subQuery + ')';
      },
      { userId },
    );

  const total = await query.getCount();

  const recordsWithoutUserCheck = await query.skip(skip).take(limit).getMany();

  res.status(200).json({
    data: recordsWithoutUserCheck,
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
