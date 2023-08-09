import { Badge, Modal, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';

import { Accordion } from './Accordion';
import EditableName from './EditableName';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import { OrganizationDataResponse, SubTableTypes } from '@/types/common';

interface Props {
  organizationsData: OrganizationDataResponse;
  organizationNames: string[];
  allUsers: User[];
  allDatasets: Dataset[];
  onDeleteOrganization: (id: string) => void;
  onDeleteMembership: (userId: string, organizationId: string) => void;
  onDeleteDatasetAccess: (datasetId: string, organizationId: string) => void;
  onAddData: (
    organizationId: string,
    usersIds?: string[],
    datasetIds?: string[],
    newName?: string,
  ) => void;
}

const TableOrganizations: React.FC<Props> = ({
  organizationsData,
  organizationNames,
  allUsers,
  allDatasets,
  onDeleteOrganization,
  onDeleteMembership,
  onDeleteDatasetAccess,
  onAddData,
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const { data: organizations } = organizationsData;

  const handleOnDelete = (id: string) => {
    setSelectedRowKey(id);
    setIsConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!selectedRowKey) {
      return;
    }

    onDeleteOrganization(selectedRowKey);

    setIsConfirmModal(false);
    setSelectedRowKey(null);
  };

  const handleCancel = () => {
    setIsConfirmModal(false);
  };

  const handleChangeNameOrganization = (
    organizationId: string,
    newName: string,
  ) => {
    const userIds = [];
    const datasetIds = [];

    onAddData(organizationId, userIds, datasetIds, newName);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <EditableName
            name={name}
            record={record}
            handleOnDelete={handleOnDelete}
            handleNameChange={handleChangeNameOrganization}
            organizationNames={organizationNames}
          />
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Member Count',
      dataIndex: 'totalMemberships',
      key: 'totalMemberships',
      render: (text: number) => <Tag>{text}</Tag>,
      sorter: (a, b) => a.totalMemberships - b.totalMemberships,
    },
    {
      title: 'Datasets',
      dataIndex: 'datasets',
      key: 'datasets',
      render: (text: string, record: any) => (
        <Badge count={record.datasetCount ? `+${record.datasetCount}` : ''}>
          <Tag style={{ cursor: 'pointer' }} color="default">
            {record.datasetFirstName || 'No dataset access'}
          </Tag>
        </Badge>
      ),
      sorter: (a, b) => a.datasetCount - b.datasetCount,
    },
  ];

  const data = organizations.map((organization) => {
    const { id, name, organizationMemberships, datasetAccess } = organization;

    return {
      key: id,
      name: name,
      totalMemberships: organizationMemberships.length,
      datasetFirstName: datasetAccess[0]?.dataset.name,
      datasetCount: datasetAccess.length && datasetAccess.length - 1,
      organization,
    };
  });

  return (
    <>
      <Modal
        title="Confirmation"
        centered
        open={isConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete the organization?</p>
      </Modal>

      <Table
        size="middle"
        pagination={false}
        dataSource={data}
        columns={columns}
        expandRowByClick
        expandable={{
          expandedRowRender: (record) => {
            const organization = organizations.find(
              (org) => org.id === record.key,
            );
            return organization ? (
              <Accordion
                typeTab={SubTableTypes.ORGANIZATIONS}
                data={organization}
                allUsers={allUsers}
                allDatasets={allDatasets}
                onDeleteMembership={onDeleteMembership}
                onDeleteDatasetAccess={onDeleteDatasetAccess}
                onAddData={onAddData}
              />
            ) : null;
          },
          showExpandColumn: false,
        }}
        rowClassName="row-table"
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedRows((prevK) => {
                if (selectedRows.includes(record.key)) {
                  return prevK.filter((key) => key !== record.key);
                }

                return [...prevK, record.key];
              });
            },
          };
        }}
      />
    </>
  );
};

export default TableOrganizations;
