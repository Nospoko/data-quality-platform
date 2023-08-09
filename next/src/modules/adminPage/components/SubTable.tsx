import { Badge, Button, Collapse, Modal, Table, Tag } from 'antd';
import React, { useCallback, useState } from 'react';

import AddingForm from './AddingForm';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { DatasetAccess } from '@/lib/orm/entity/DatasetAccess';
import { Organization } from '@/lib/orm/entity/Organization';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { User } from '@/lib/orm/entity/User';
import { OnAddParams, SubTableTypes } from '@/types/common';

interface SubTableProps<T> {
  type:
    | SubTableTypes.MEMBERSHIPS
    | SubTableTypes.DATASETACCESS
    | SubTableTypes.ORGANIZATIONS;
  mainId: string;
  data: T[];
  allData: (User | Dataset)[];
  onDelete: (id: string, mainId: string) => void;
  onAddData: (
    organizationId: string,
    usersIds?: string[],
    datasetIds?: string[],
    newName?: string,
  ) => void | ((userId: string, organizationIds: string[]) => void);
}

const SubTable: React.FC<
  SubTableProps<OrganizationMembership | DatasetAccess | Organization>
> = ({ type, mainId, data, allData, onDelete, onAddData }) => {
  const isMembershipType = type === SubTableTypes.MEMBERSHIPS;
  const isDatasetAccessType = type === SubTableTypes.DATASETACCESS;
  const columns = isMembershipType
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
    : isDatasetAccessType
    ? [
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
      ]
    : [
        {
          title: 'Name',
          dataIndex: 'organizationName',
          key: 'organizationName',
        },
        {
          title: 'Dataset Access',
          dataIndex: SubTableTypes.DATASETACCESS,
          key: SubTableTypes.DATASETACCESS,
          render: (text: string, record: any) => (
            <Badge count={record.totalDatasetLeft}>
              <Tag color="default">
                {record.firstDatasetName || 'No dataset access'}
              </Tag>
            </Badge>
          ),
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

    isMembershipType || isDatasetAccessType
      ? onDelete(selectedRowKey, mainId)
      : onDelete(mainId, selectedRowKey);

    setIsConfirmModal(false);
    setSelectedRowKey(null);
  };

  const handleCancel = () => {
    setIsConfirmModal(false);
  };

  const handleAdd = (params: OnAddParams) => {
    if (isMembershipType) {
      const { selectedUsers: userIds } = params as { selectedUsers: string[] };

      onAddData(mainId, userIds);

      return;
    }

    if (isDatasetAccessType) {
      const { selectedDatasets: datasetIds } = params as {
        selectedDatasets: string[];
      };
      const userIds = [];

      onAddData(mainId, userIds, datasetIds);

      return;
    }

    const { selectedOrganizations: organizationIds } = params as {
      selectedOrganizations: string[];
    };

    onAddData(mainId, organizationIds);
  };

  const dataSource = isMembershipType
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
    : isDatasetAccessType
    ? data.map((item) => {
        if ('dataset' in item) {
          const { dataset } = item as DatasetAccess;
          return {
            key: dataset.id,
            datasetName: dataset.name,
          };
        }
        return {};
      })
    : data.map((item) => {
        if ('organization' in item) {
          const { organization } = item;
          return {
            key: organization.id,
            organizationName: organization.name,
            firstDatasetName: organization.datasetAccess[0]?.dataset.name,
            totalDatasetLeft:
              organization.datasetAccess.length &&
              organization.datasetAccess.length - 1,
          };
        }
        return {};
      });

  const existedIds = isMembershipType
    ? data.map((membership: OrganizationMembership) => membership.user.id)
    : isDatasetAccessType
    ? data.map((datasetAccess: DatasetAccess) => datasetAccess.dataset.id)
    : data.map((organizationMemberships: OrganizationMembership) => {
        return organizationMemberships.organization.id;
      });

  const filteredAllData = isMembershipType
    ? allData.filter((user: User) => !existedIds.includes(user.id))
    : isDatasetAccessType
    ? allData.filter((dataset: Dataset) => !existedIds.includes(dataset.id))
    : allData.filter(
        (organization: Organization) => !existedIds.includes(organization.id),
      );

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
            isMembershipType
              ? 'Organization Memberships'
              : isDatasetAccessType
              ? 'Dataset Access'
              : 'Organizations'
          }
          key="1"
        >
          <Button
            type="primary"
            onClick={handleOpenCreateView}
            style={{ marginBottom: 16 }}
          >
            {isMembershipType
              ? 'Add New Membership'
              : isDatasetAccessType
              ? 'Add New Dataset'
              : 'Add organization'}
          </Button>

          <Table dataSource={dataSource} columns={columns} pagination={false} />
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
          {isMembershipType
            ? 'membership'
            : isDatasetAccessType
            ? 'access'
            : 'organization'}
          ?
        </p>
      </Modal>
    </>
  );
};

export default SubTable;
