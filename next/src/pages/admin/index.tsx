import { ReactElement } from 'react';

import CustomLayout from '@/components/layouts/layout';
import withNecessaryUserRoleAuth from '@/hoc/withNecessaryUserRoleAuth';
import AdminPage from '@/modules/adminPage/pages/AdminPage';
import { UserRole } from '@/types/common';

const Admin = () => {
  return <AdminPage></AdminPage>;
};

Admin.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withNecessaryUserRoleAuth(Admin, Admin.getNestedLayout, [
  UserRole.ADMIN,
]);
