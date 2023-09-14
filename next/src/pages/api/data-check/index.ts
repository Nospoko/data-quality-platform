import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';

import { authOptions } from '../auth/[...nextauth]';

import { customGetRepository } from '@/lib/orm/data-source';
import { DataCheck } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  const { id, choice, comment, rhythm, quality, metadata } = req.body;
  const dataCheckRepo = await customGetRepository(DataCheck);
  const recordRepo = await customGetRepository(Record);
  const record = await recordRepo.findOne({ where: { id } });

  if (!record) {
    return res.status(400).json({ error: 'Record not found' });
  }

  const newDataCheck = await dataCheckRepo.create({
    choice,
    user: session.user.id,
    record,
    comment,
    score1: rhythm,
    score2: quality,
    metadata,
  });

  const result = await dataCheckRepo.save(newDataCheck);

  if (result) {
    return res.status(200).json({ dataCheck: result });
  }
});

router.patch(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  const { dataCheckId, choice, metadata, comment, rhythm, quality } = req.body;

  const dataCheckRepo = await customGetRepository(DataCheck);
  const existingDataCheck = await dataCheckRepo.findOne({
    where: { id: dataCheckId },
  });

  if (!existingDataCheck) {
    return res.status(404).json({ error: 'DataCheck not found' });
  }

  if (choice) {
    existingDataCheck.choice = choice;
    if (metadata) {
      existingDataCheck.metadata = metadata;
    }
  } else {
    existingDataCheck.comment = comment;
    existingDataCheck.score1 = rhythm;
    existingDataCheck.score2 = quality;
  }

  await dataCheckRepo.save(existingDataCheck);

  return res.status(200).json(existingDataCheck);
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
