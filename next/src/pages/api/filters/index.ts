import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { customGetRepository } from '@/lib/orm/data-source';
import { Record } from '@/lib/orm/entity/Record';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  const field = req.query.field as string;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  const recordsRepo = await customGetRepository(Record);

  const query = recordsRepo
    .createQueryBuilder('record')
    .select(`record.metadata->>'${field}'`, 'value')
    .where(`record.metadata->>'${field}' IS NOT NULL`)
    .groupBy(`record.metadata->>'${field}'`);

  const queryResult = await query.getRawMany();

  const filters = queryResult.map((row) => row.value);

  res.status(200).json(filters);
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
