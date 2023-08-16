import { ReactElement } from 'react';

import CustomLayout from '@/components/layouts/layout';
import withNecessaryUserRoleAuth from '@/hoc/withNecessaryUserRoleAuth';
import DashboardDatasetSelect from '@/modules/dashboardPage/pages/DashboardDatasetSelect';
import { UserRole } from '@/types/common';

const DashboardIndex = () => {
  return <DashboardDatasetSelect></DashboardDatasetSelect>;
};

DashboardIndex.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withNecessaryUserRoleAuth(
  DashboardIndex,
  DashboardIndex.getNestedLayout,
  [UserRole.MEMBER, UserRole.ADMIN],
  '/guide',
);
