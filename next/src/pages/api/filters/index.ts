import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { customGetRepository } from '@/lib/orm/data-source';
import { Record } from '@/lib/orm/entity/Record';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  const recordsRepo = await customGetRepository(Record);

  const query = recordsRepo
    .createQueryBuilder('record')
    .select('record.metadata->>exam_uid', 'exam_uid')
    .where('record.metadata->>exam_uid IS NOT NULL')
    .groupBy('record.metadata->>exam_uid');

  const exam_uids = await query.getRawMany();

  const examUids = exam_uids.map((row) => row.record_exam_uid);

  res.status(200).json(examUids);
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
