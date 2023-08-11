import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { customGetRepository } from '@/lib/orm/data-source';
import { Dataset } from '@/lib/orm/entity/Dataset';
import { DatasetAccess } from '@/lib/orm/entity/DatasetAccess';
import { authenticateUser } from '@/modules/adminPage/pages/middleware/authAdminMiddleware';

const router = createRouter<NextApiRequest, NextApiResponse>();

// These route handlers define a RESTful API for managing datasets, including creating,
// reading, updating, and deleting dataset records
router.get(authenticateUser, async (req, res) => {
  const datasetRepo = await customGetRepository(Dataset);

  const datasets = await datasetRepo.find({ order: { name: 'ASC' } });

  if (datasets) {
    return res.status(200).json(datasets);
  }

  return res.status(404).json({ error: 'No datasets found.' });
});

router.post(authenticateUser, async (req, res) => {
  const { name } = req.body;

  const datasetRepo = await customGetRepository(Dataset);

  const foundDataset = await datasetRepo.findOne({ where: { name } });

  if (foundDataset) {
    return res.status(409).json({
      error: 'The Dataset with the same name already exists.',
    });
  }

  const createdDataset = await datasetRepo.create(name);
  const newDataset = await datasetRepo.save(createdDataset);

  if (newDataset) {
    return res.status(201).json(newDataset);
  }
});

router.patch(authenticateUser, async (req, res) => {
  const { datasetId: id, isActive, newName } = req.body;
  // an environment variable named NEXT_PUBLIC_MAX_ACTIVE_DATASETS. This variable
  // represents the maximum number of active datasets that are allowed
  const maxActive = Number(process.env.NEXT_PUBLIC_MAX_ACTIVE_DATASETS);

  if (!id) {
    return res.status(400).json({ error: 'Dataset ID is required.' });
  }

  const datasetRepo = await customGetRepository(Dataset);

  const foundDataset = await datasetRepo.findOne({ where: { id } });

  if (!foundDataset) {
    return res.status(404).json({
      error: 'The Dataset not found.',
    });
  }

  if (newName) {
    foundDataset.name = newName;

    const changedDataset = await datasetRepo.save(foundDataset);

    if (changedDataset) {
      return res.status(200).json(changedDataset);
    }
  }

  if (isActive === undefined) {
    return res.status(400).json({ error: 'The Dataset Status is required.' });
  }

  const allActive = await datasetRepo.find({ where: { isActive: true } });

  // If the isActive status is provided, checks if the maximum number of active datasets has been reached
  if (allActive.length === maxActive && isActive) {
    return res
      .status(400)
      .json({ error: 'Maximum number of active datasets reached.' });
  }

  foundDataset.isActive = isActive;
  const changedDataset = await datasetRepo.save(foundDataset);

  if (changedDataset) {
    return res.status(200).json(changedDataset);
  }
});

router.delete(authenticateUser, async (req, res) => {
  const { datasetId: id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Dataset ID is required.' });
  }

  const datasetRepo = await customGetRepository(Dataset);

  const foundDataset = await datasetRepo.find({ where: { id: id as string } });

  if (!foundDataset) {
    return res.status(404).json({ error: 'Dataset not found.' });
  }

  const datasetAccessRepo = await customGetRepository(DatasetAccess);

  await datasetAccessRepo.delete({ dataset: { id: id as string } });

  const deletedDataset = await datasetRepo.remove(foundDataset);

  if (deletedDataset) {
    return res.status(204).end();
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
