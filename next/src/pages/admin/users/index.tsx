import { ReactElement } from 'react';

import withAdminAuthorization from '../withAdminAuthorization';

import CustomLayout from '@/components/layouts/layout';
import UsersPage from '@/modules/homeChart/pages/UsersPage';

const Users = () => {
  return <UsersPage></UsersPage>;
};

Users.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withAdminAuthorization(Users, Users.getNestedLayout);
