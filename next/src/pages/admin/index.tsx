import { ReactElement } from 'react';

import withNecessaryUserRoleAuth from '@/components/hoc/withNecessaryUserRoleAuth';
import CustomLayout from '@/components/layouts/layout';
import AdminPage from '@/modules/admin/pages/AdminPage';
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
