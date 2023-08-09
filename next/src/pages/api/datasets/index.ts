import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { customGetRepository } from '@/lib/orm/data-source';
import { Dataset } from '@/lib/orm/entity/Dataset';
import { DatasetAccess } from '@/lib/orm/entity/DatasetAccess';
import { authenticateUser } from '@/modules/adminPage/pages/middleware/authAdminMiddleware';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(authenticateUser, async (req, res) => {
  const datasetRepo = await customGetRepository(Dataset);

  const datasets = await datasetRepo.find();

  if (datasets) {
    return res.status(200).json(datasets);
  }

  return res.status(404).json({ error: 'No datasets found.' });
});

router.delete(authenticateUser, async (req, res) => {
  const { datasetId, organizationId } = req.query;

  if (!organizationId || !datasetId) {
    return res
      .status(400)
      .json({ error: 'Organization ID and Dataset ID are required.' });
  }

  const datasetAccessRepo = await customGetRepository(DatasetAccess);

  await datasetAccessRepo
    .createQueryBuilder()
    .delete()
    .where('dataset.id = :datasetId', { datasetId: datasetId as string })
    .andWhere('organization.id = :organizationId', {
      organizationId: organizationId as string,
    })
    .execute();

  return res.status(204).end();
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
