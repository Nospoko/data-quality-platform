import { BankOutlined } from '@ant-design/icons';
import { Button, Layout, message } from 'antd';
import React, { useCallback, useState } from 'react';

import CreateNewOrganizationForm from './CreateNewOrganizationForm';
import TableOrganizations from './TableOrganizations';

import { OrganizationDataResponse } from '@/types/common';

interface Props {
  organizationNames: string[];
  organizationsData?: OrganizationDataResponse;
  onCreateOrganization: ({ name }: { name: string }) => void;
}

const OrganizationsTab: React.FC<Props> = ({
  organizationNames,
  organizationsData,
  onCreateOrganization,
}) => {
  const [createView, setCreateView] = useState(false);

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
          onClose={handleCloseCreateView}
          onCreate={onCreateOrganization}
        />
      )}

      {organizationsData && (
        <TableOrganizations organizationsData={organizationsData} />
      )}
    </Layout>
  );
};

export default OrganizationsTab;
