import { RotateRightOutlined } from '@ant-design/icons';
import { Layout, Space, Typography } from 'antd';
import React, { ChangeEvent, useState } from 'react';

import { FilteringForm } from './FilteringForm';
import TableUsers from './TableUsers';

import { Organization } from '@/lib/orm/entity/Organization';
import { User } from '@/lib/orm/entity/User';
import { getFilteredUsers } from '@/modules/admin/utils/helpers/UsersFiltering';
import useScreenWidth from '@/modules/admin/utils/hooks/useScreenWidth';
import { UserRole } from '@/types/common';

interface Props {
  users: User[];
  allOrganizations: Organization[];
  onAddOrganizations: (userId: string, organizationIds: string[]) => void;
  onDeleteMembership: (userId: string, organizationId: string) => void;
  onChangeRole: (userId: string, role: string) => void;
}

const UsersTab: React.FC<Props> = ({
  users,
  allOrganizations,
  onAddOrganizations,
  onDeleteMembership,
  onChangeRole,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortRole, setSortRole] = useState<UserRole[]>([]);

  const roleOptions = Object.values(UserRole).map((role) => ({
    value: role,
    label: role,
  }));

  const screenWidth = useScreenWidth();

  const handleOnSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleChangeSortType = (value: UserRole[]) => {
    setSortRole(value);
  };

  const handleReset = () => {
    setSearchText('');
    setSortRole([]);
  };

  const visibleUsers = getFilteredUsers(users, searchText, sortRole);

  return users && screenWidth > 670 ? (
    <Space direction="vertical" style={{ width: '100%' }}>
      <FilteringForm
        inputValue={searchText}
        inputPlaceholder="Input First or Last name"
        selectValue={sortRole}
        selectOptions={roleOptions}
        selectPlaceholder="Select a role"
        onInputChange={handleOnSearch}
        onSelectChange={handleChangeSortType}
        onResetFilters={handleReset}
      />

      <TableUsers
        users={visibleUsers}
        allOrganizations={allOrganizations}
        onAddOrganizations={onAddOrganizations}
        onDeleteMembership={onDeleteMembership}
        onChangeRole={onChangeRole}
      />
    </Space>
  ) : (
    <Layout style={{ alignItems: 'center', textAlign: 'center' }}>
      <Typography.Title>Please, rotate your device.</Typography.Title>
      <RotateRightOutlined style={{ fontSize: '100px' }} />
    </Layout>
  );
};

export default UsersTab;
