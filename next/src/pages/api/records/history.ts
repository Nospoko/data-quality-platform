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

  const datasetName = req.query.datasetName as string;
  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;
  const exams = req.query['exams[]'];
  const examIds = Array.isArray(exams) ? exams : [exams];

  const dataCheckRepo = await customGetRepository(DataCheck);
  const userId = session.user.id;

  const query = dataCheckRepo
    .createQueryBuilder('dataCheck')
    .innerJoinAndSelect('dataCheck.record', 'record')
    .innerJoinAndSelect('dataCheck.user', 'user')
    .where('user.id = :userId AND record.dataset_name = :datasetName', {
      userId,
      datasetName,
    });

  if (exams) {
    query.andWhere('record.metadata->>exam_uid IN (:...examIds)', {
      examIds,
    });
  }

  query.orderBy('dataCheck.createdAt', 'DESC');

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
