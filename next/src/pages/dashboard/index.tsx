import { ReactElement } from 'react';

import withNecessaryUserRoleAuth from '@/components/hoc/withNecessaryUserRoleAuth';
import CustomLayout from '@/components/layouts/layout';
import DashboardDatasetSelect from '@/modules/dashboard/pages/DashboardDatasetSelect';
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
