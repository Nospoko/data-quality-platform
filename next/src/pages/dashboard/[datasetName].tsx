import { ReactElement } from 'react';

import withNecessaryUserRoleAuth from '@/components/hoc/withNecessaryUserRoleAuth';
import CustomLayout from '@/components/layouts/layout';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import { UserRole } from '@/types/common';

const Dashboard = () => {
  return <DashboardPage></DashboardPage>;
};

Dashboard.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withNecessaryUserRoleAuth(Dashboard, Dashboard.getNestedLayout, [
  UserRole.MEMBER,
  UserRole.ADMIN,
]);
