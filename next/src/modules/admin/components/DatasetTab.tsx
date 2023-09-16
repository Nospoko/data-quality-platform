import { DatabaseOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Layout, Row } from 'antd';
import React, { useCallback, useState } from 'react';

import CreateNewDatasetForm from './CreateNewDatasetForm';
import TableDatasets from './TableDatasets';

import { Dataset } from '@/lib/orm/entity/Dataset';

interface Props {
  datasets: Dataset[];
  onCreateNewDataset: (name: string) => void;
  onChangeStatus: (datasetId: string, isActive: boolean) => void;
  onChangeDatasetName: (datasetId: string, newName: string) => void;
  onDeleteDataset: (datasetId: string) => void;
  onSync: (datasetsToSync: { name: string; isActive: boolean }[]) => void;
}

// his component provides a user interface for managing datasets, allowing users to
// synchronize data, create new datasets, and interact with existing datasets.
const DatasetTab: React.FC<Props> = ({
  datasets,
  onCreateNewDataset,
  onChangeStatus,
  onChangeDatasetName,
  onDeleteDataset,
  onSync,
}) => {
  const [createView, setCreateView] = useState(false);
  // Save datasets to synchronize
  const [datasetsToSynchronize, setDatasetsToSynchronize] = useState<
    { name: string; isActive: boolean }[]
  >([]);

  const handleOpenCreateView = useCallback(() => {
    setCreateView(true);
  }, []);

  const handleCloseCreateView = useCallback(() => {
    setCreateView(false);
  }, []);

  const handleSelectedDatasets = (
    datasetsToSync: { name: string; isActive: boolean }[],
  ) => {
    setDatasetsToSynchronize(datasetsToSync);
  };

  const handleSyncData = () => {
    onSync(datasetsToSynchronize);
    setDatasetsToSynchronize([]);
  };

  return (
    <Layout>
      <Row style={{ justifyContent: 'space-between' }}>
        <Button
          type="primary"
          size="small"
          style={{ marginBottom: '16px' }}
          icon={<SyncOutlined />}
          onClick={handleSyncData}
          disabled={datasetsToSynchronize.length === 0}
        >
          Synchronize API
        </Button>

        <Button
          type="primary"
          size="small"
          icon={<DatabaseOutlined />}
          onClick={handleOpenCreateView}
          disabled={!datasets}
        >
          Create New Dataset
        </Button>
      </Row>

      {datasets && (
        <CreateNewDatasetForm
          datasets={datasets}
          isOpen={createView}
          onClose={handleCloseCreateView}
          onCreate={onCreateNewDataset}
        />
      )}

      {datasets && (
        <TableDatasets
          datasets={datasets}
          onChangeStatus={onChangeStatus}
          onChangeDatasetName={onChangeDatasetName}
          onDeleteDataset={onDeleteDataset}
          onSelectedDatasets={handleSelectedDatasets}
        />
      )}
    </Layout>
  );
};

export default DatasetTab;
