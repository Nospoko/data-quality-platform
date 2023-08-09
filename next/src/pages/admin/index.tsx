import { ReactElement } from 'react';

import withAdminAuthorization from './withAdminAuthorization';

import CustomLayout from '@/components/layouts/layout';
import AdminPage from '@/modules/adminPage/pages/AdminPage';

const Admin = () => {
  return <AdminPage></AdminPage>;
};

Admin.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withAdminAuthorization(Admin, Admin.getNestedLayout);
