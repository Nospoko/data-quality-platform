import { BankOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import React, { useCallback, useState } from 'react';

import CreateNewOrganizationForm from './CreateNewOrganizationForm';
import TableOrganizations from './TableOrganizations';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import {
  CreateOrganizationArgs,
  OrganizationDataResponse,
} from '@/types/common';

interface Props {
  organizationNames: string[];
  organizationsData?: OrganizationDataResponse;
  allUsers: User[];
  allDatasets: Dataset[];
  onCreateOrganization: (createObj: CreateOrganizationArgs) => void;
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

const OrganizationsTab: React.FC<Props> = ({
  organizationNames,
  organizationsData,
  allUsers,
  allDatasets,
  onCreateOrganization,
  onDeleteOrganization,
  onDeleteMembership,
  onDeleteDatasetAccess,
  onAddData,
}) => {
  const [createView, setCreateView] = useState(false);
  // Filter the dataset by active status to get access to add to a new organization only active datasets
  const onlyActiveDatasets = allDatasets.filter(({ isActive }) => isActive);

  const handleOpenCreateView = useCallback(() => {
    setCreateView(true);
  }, []);

  const handleCloseCreateView = useCallback(() => {
    setCreateView(false);
  }, []);

  return (
    <Layout>
      <Button
        type="primary"
        size="small"
        style={{ alignSelf: 'flex-end', marginBottom: '16px' }}
        icon={<BankOutlined />}
        onClick={handleOpenCreateView}
        disabled={!organizationNames}
      >
        Create New Organization
      </Button>

      {organizationNames && (
        <CreateNewOrganizationForm
          isOpen={createView}
          organizationNames={organizationNames}
          allUsers={allUsers}
          allDatasets={onlyActiveDatasets}
          onClose={handleCloseCreateView}
          onCreate={onCreateOrganization}
        />
      )}

      {organizationsData && (
        <TableOrganizations
          organizationsData={organizationsData}
          organizationNames={organizationNames}
          allUsers={allUsers}
          allDatasets={allDatasets}
          onDeleteOrganization={onDeleteOrganization}
          onDeleteMembership={onDeleteMembership}
          onDeleteDatasetAccess={onDeleteDatasetAccess}
          onAddData={onAddData}
        />
      )}
    </Layout>
  );
};

export default OrganizationsTab;
