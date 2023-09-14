import { Button, Modal, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import EditableName from './EditableName';

import { Dataset } from '@/lib/orm/entity/Dataset';

interface Props {
  datasets: Dataset[];
  onChangeStatus: (datasetId: string, isActive: boolean) => void;
  onChangeDatasetName: (datasetId: string, newName: string) => void;
  onDeleteDataset: (datasetId: string) => void;
  onSelectedDatasets: (datasets: { name: string; isActive: boolean }[]) => void;
}

// This component provides a way to display and manage datasets in a tabular format,
//  allowing users to edit names, change status, and delete datasets
const TableDatasets: React.FC<Props> = ({
  datasets,
  onChangeStatus,
  onChangeDatasetName,
  onDeleteDataset,
  onSelectedDatasets,
}) => {
  const [isDisableAction, setIsDisableAction] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  // The maximum number of active datasets and the count of all active datasets
  // are calculated based on the environment variable NEXT_PUBLIC_MAX_ACTIVE_DATASETS.
  const maxActiveDatasets = Number(process.env.NEXT_PUBLIC_MAX_ACTIVE_DATASETS);
  const allActiveDatasets = datasets.filter(
    ({ isActive }) => isActive === true,
  ).length;
  const allDatasetNames = datasets.map(({ name }) => name);

  useEffect(() => {
    if (allActiveDatasets >= maxActiveDatasets) {
      setIsDisableAction(true);

      return;
    }

    setIsDisableAction(false);
  }, [allActiveDatasets]);

  const handleStatusChange = (datasetId: string, isActive: boolean) => {
    onChangeStatus(datasetId, !isActive);

    onSelectedDatasets(datasets);
  };

  const handleOnDelete = (id: string) => {
    setSelectedRowKey(id);
    setIsConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!selectedRowKey) {
      return;
    }

    onDeleteDataset(selectedRowKey);

    setIsConfirmModal(false);
    setSelectedRowKey(null);
  };

  const handleCancel = () => {
    setIsConfirmModal(false);
  };

  const handleChangeName = (datasetId: string, newName: string) => {
    onChangeDatasetName(datasetId, newName);
  };

  const columns = [
    {
      title: 'Dataset Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <EditableName
            name={name}
            record={record}
            handleOnDelete={handleOnDelete}
            handleNameChange={handleChangeName}
            allNames={allDatasetNames}
          />
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, { isActive }) => {
        const tagText = isActive ? 'Active' : 'Not Active';
        const color = isActive ? 'green' : 'red';

        return (
          <Tag style={{ backgroundColor: color, color: '#fff' }}>{tagText}</Tag>
        );
      },
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type={record.isActive ? 'default' : 'primary'}
          size="small"
          disabled={isDisableAction && record.isActive === false}
          onClick={() => handleStatusChange(record.key, record.isActive)}
        >
          {record.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];

  const data = datasets.map(({ id, name, isActive }: Dataset) => ({
    key: id,
    name,
    isActive,
  }));

  return (
    <>
      <Modal
        title="Confirmation"
        centered
        open={isConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete the dataset?</p>
      </Modal>

      <Table
        size="middle"
        pagination={false}
        dataSource={data}
        columns={columns}
        rowClassName="row-table"
      />
    </>
  );
};

export default TableDatasets;

export const AccordionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 350px;

  @media (min-width: 744px) {
    max-width: 700px;
  }

  @media (min-width: 1000px) {
    max-width: 880px;
  }

  @media (min-width: 1200px) {
    max-width: 1080px;
  }

  @media (min-width: 1400px) {
    max-width: 100%;
  }
`;
