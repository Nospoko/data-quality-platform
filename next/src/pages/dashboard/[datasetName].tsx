import { ReactElement } from 'react';

import CustomLayout from '@/components/layouts/layout';
import withNecessaryUserRoleAuth from '@/hoc/withNecessaryUserRoleAuth';
import DashboardPage from '@/modules/dashboardPage/pages/DashboardPage';
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
