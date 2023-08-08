import { RotateRightOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';
import React from 'react';

import useScreenWidth from '../homeChart/utils/hooks/useScreenWidth';
import TableUsers from './TableUsers';

import { Organization } from '@/lib/orm/entity/Organization';
import { User } from '@/lib/orm/entity/User';

interface Props {
  users: User[];
  allOrganizations: Organization[];
  onAddOrganizations: (userId: string, organizationIds: string[]) => void;
  onDeleteMembership: (userId: string, organizationId: string) => void;
}

const UsersTab: React.FC<Props> = ({
  users,
  allOrganizations,
  onAddOrganizations,
  onDeleteMembership,
}) => {
  const screenWidth = useScreenWidth();

  return users && screenWidth > 670 ? (
    <TableUsers
      users={users}
      allOrganizations={allOrganizations}
      onAddOrganizations={onAddOrganizations}
      onDeleteMembership={onDeleteMembership}
    />
  ) : (
    <Layout style={{ alignItems: 'center', textAlign: 'center' }}>
      <Typography.Title>Please, rotate your device.</Typography.Title>
      <RotateRightOutlined style={{ fontSize: '100px' }} />
    </Layout>
  );
};

export default UsersTab;
