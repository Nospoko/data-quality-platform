import { ClusterOutlined, TeamOutlined } from '@ant-design/icons';
import { Divider, Layout, Tabs } from 'antd';
import React from 'react';

import OrganizationsTab from '@/modules/adminPage/OrganizationsTab';
import UsersTab from '@/modules/adminPage/UsersTab';

const AdminPage = () => {
  return (
    <Layout>
      <Tabs
        defaultActiveKey="1"
        centered
        size="middle"
        type="card"
        items={[
          {
            key: '1',
            label: (
              <>
                <ClusterOutlined />
                Organizations
              </>
            ),
            children: <OrganizationsTab />,
          },
          {
            key: '2',
            label: (
              <>
                <TeamOutlined />
                Users
              </>
            ),
            children: <UsersTab />,
          },
        ]}
      />

      <Divider />
    </Layout>
  );
};

export default AdminPage;
