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
  const datasetName = req.query.datasetName as string;
  const limit = Number(req.query.limit) || 10;
  const filterValues = req.query['filterValues[]'];
  const filters = Array.isArray(filterValues) ? filterValues : [filterValues];
  const field = req.query.field;

  const recordsRepo = await customGetRepository(Record);
  const userId = session.user.id;
  const query = recordsRepo
    .createQueryBuilder('record')
    .leftJoinAndSelect('record.dataChecks', 'dataCheck')
    .where('record.dataset_name = :datasetName', { datasetName })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select('dataCheck_sub.id')
          .from(DataCheck, 'dataCheck_sub')
          .where('dataCheck_sub.record_id = record.id')
          .andWhere('dataCheck_sub.user_id = :userId')
          .getQuery();
        return 'NOT EXISTS (' + subQuery + ')';
      },
      { userId },
    );

  if (filterValues && field) {
    query.andWhere(`record.metadata->>'${field}' IN (:...filters)`, {
      filters,
    });
  }

  // I've added the orderBy('RANDOM()') clause to the query,
  // which orders the records randomly.
  const [recordsWithoutUserCheck, total] = await query
    .orderBy('RANDOM()')
    .limit(limit)
    .getManyAndCount();

  res.status(200).json({
    data: recordsWithoutUserCheck.map((record) => {
      return {
        ...record,
        metadata: {
          ...record.metadata,
          segments: JSON.parse(record.metadata.segments),
        },
      };
    }),
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
