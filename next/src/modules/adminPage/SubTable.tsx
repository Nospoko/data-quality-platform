import { Button, Collapse, Modal, Table } from 'antd';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import AddingForm from './AddingForm';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { DatasetAccess } from '@/lib/orm/entity/DatasetAccess';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { User } from '@/lib/orm/entity/User';
import { OnAddParams } from '@/types/common';

interface SubTableProps<T> {
  type: 'memberships' | 'datasetAccess';
  organizationId: string;
  data: T[];
  allData: (User | Dataset)[];
  onDelete: (id: string, organizationId: string) => void;
  onAddData: (
    organizationId: string,
    usersIds?: string[],
    datasetIds?: string[],
    newName?: string,
  ) => void;
}

const SubTable: React.FC<
  SubTableProps<OrganizationMembership | DatasetAccess>
> = ({ type, organizationId, data, allData, onDelete, onAddData }) => {
  const columns =
    type === 'memberships'
      ? [
          {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
          },
          {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
              <Button
                type="link"
                style={{ color: 'red' }}
                size="small"
                onClick={() => handleDelete(record.key)}
              >
                Delete
              </Button>
            ),
          },
        ]
      : [
          {
            title: 'Dataset Name',
            dataIndex: 'datasetName',
            key: 'datasetName',
          },
          {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
              <Button
                type="link"
                style={{ color: 'red' }}
                size="small"
                onClick={() => handleDelete(record.key)}
              >
                Delete
              </Button>
            ),
          },
        ];

  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [addView, setAddView] = useState(false);

  const handleOpenCreateView = useCallback(() => {
    setAddView(true);
  }, []);

  const handleCloseCreateView = useCallback(() => {
    setAddView(false);
  }, []);

  const handleDelete = (id: string) => {
    setSelectedRowKey(id);
    setIsConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!selectedRowKey) {
      return;
    }

    onDelete(selectedRowKey, organizationId);

    setIsConfirmModal(false);
    setSelectedRowKey(null);
  };

  const handleCancel = () => {
    setIsConfirmModal(false);
  };

  const handleAdd = (params: OnAddParams) => {
    if (type === 'memberships') {
      const { selectedUsers: userIds } = params as { selectedUsers: string[] };

      onAddData(organizationId, userIds);

      return;
    }

    const { selectedDatasets: datasetIds } = params as {
      selectedDatasets: string[];
    };
    const userIds = [];

    onAddData(organizationId, userIds, datasetIds);
  };

  const dataSource =
    type === 'memberships'
      ? data.map((item) => {
          if ('user' in item) {
            const { user } = item as OrganizationMembership;
            return {
              key: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            };
          }
          return {};
        })
      : data.map((item) => {
          if ('dataset' in item) {
            const { dataset } = item as DatasetAccess;
            return {
              key: dataset.id,
              datasetName: dataset.name,
            };
          }
          return {};
        });

  const existedIds =
    type === 'memberships'
      ? data.map((membership: OrganizationMembership) => membership.user.id)
      : data.map((datasetAccess: DatasetAccess) => datasetAccess.dataset.id);

  const filteredAllData =
    type === 'memberships'
      ? allData.filter((user: User) => !existedIds.includes(user.id))
      : allData.filter((dataset: Dataset) => !existedIds.includes(dataset.id));

  return (
    <>
      <AddingForm
        type={type}
        isOpen={addView}
        allData={filteredAllData}
        onClose={handleCloseCreateView}
        onAdd={handleAdd}
      />

      <Collapse>
        <Collapse.Panel
          header={
            type === 'memberships'
              ? 'Organization Memberships'
              : 'Dataset Access'
          }
          key="1"
        >
          <Button
            type="primary"
            onClick={handleOpenCreateView}
            style={{ marginBottom: 16 }}
          >
            {type === 'memberships' ? 'Add New Membership' : 'Add New Dataset'}
          </Button>

          <StyledTable
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </Collapse.Panel>
      </Collapse>
      <Modal
        title="Confirmation"
        centered
        open={isConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>
          Are you sure you want to delete the{' '}
          {type === 'memberships' ? 'membership' : 'access'}?
        </p>
      </Modal>
    </>
  );
};

const StyledTable = styled(Table)`
  .ant-table-cell {
    padding: 8px 16px;
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background-color: transparent;
  }
`;

export default SubTable;
