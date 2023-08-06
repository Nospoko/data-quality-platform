import { DeleteOutlined } from '@ant-design/icons';
import { Badge, Button, Modal, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { AccordionOrganizations } from './AccordionOrganizations';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import { OrganizationDataResponse } from '@/types/common';

interface Props {
  organizationsData: OrganizationDataResponse;
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
    if (!selectedRows.includes(id)) {
      return;
    }

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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {name}
          <Button
            type="link"
            style={{
              color: selectedRows.includes(record.key) ? 'red' : 'transparent',
            }}
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleOnDelete(record.key);
            }}
            className="delete-button"
          />
        </Space>
      ),
    },
    {
      title: 'Member Count',
      dataIndex: 'totalMemberships',
      key: 'totalMemberships',
      render: (text: number) => <Tag>{text}</Tag>,
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
              <AccordionOrganizations
                organization={organization}
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
        components={{
          body: {
            row: StyledTableRow,
          },
        }}
      />
    </>
  );
};

export default TableOrganizations;

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

const StyledTableRow = styled.tr`
  .delete-button {
    color: transparent;
  }

  cursor: pointer;

  &:active .delete-button {
    color: red;

    &:hover {
      color: lightcoral;
    }
  }
`;
