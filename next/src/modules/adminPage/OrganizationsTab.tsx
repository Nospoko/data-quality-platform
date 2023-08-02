import { BankOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import React, { useCallback, useState } from 'react';

import CreateNewOrganizationForm from './CreateNewOrganizationForm';

const OrganizationsTab = () => {
  const [createView, setCreateView] = useState(false);

  const handleOpenCreateView = useCallback(() => {
    setCreateView(true);
  }, []);

  const handleCloseCreateView = useCallback(() => {
    setCreateView(false);
  }, []);

  const createOrganization = ({ name }: { name: string }) => {
    //
  };

  return (
    <Layout>
      <Button
        type="primary"
        size="large"
        style={{ alignSelf: 'flex-end' }}
        icon={<BankOutlined />}
        onClick={handleOpenCreateView}
      >
        Create New Organization
      </Button>

      <CreateNewOrganizationForm
        isOpen={createView}
        onClose={handleCloseCreateView}
        onCreate={createOrganization}
      />
    </Layout>
  );
};

export default OrganizationsTab;
