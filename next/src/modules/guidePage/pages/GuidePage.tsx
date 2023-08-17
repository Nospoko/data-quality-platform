import { Layout, Typography } from 'antd';
import { useSession } from 'next-auth/react';

import { UserRole } from '@/types/common';

const GuidePage = () => {
  const { data: session } = useSession();
  const userRole = session?.user.role;
  const isGuest = userRole === UserRole.GUEST;

  return (
    <Layout>
      {isGuest && (
        <>
          <Typography.Title style={{ textAlign: 'center', marginBottom: '0' }}>
            Welcome, New User!
          </Typography.Title>
          <Typography.Title
            level={4}
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            Thank you for registering. You are now a member of our platform. To
            get started, please wait for an administrator to add you to an
            organization.
          </Typography.Title>
        </>
      )}
      <Typography.Title
        level={2}
        style={{ textAlign: 'center', marginBottom: '16px' }}
      >
        Guide for the Data Quality Platform
      </Typography.Title>
    </Layout>
  );
};

export default GuidePage;
