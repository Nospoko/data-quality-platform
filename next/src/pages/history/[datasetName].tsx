import { ReactElement } from 'react';

import CustomLayout from '@/components/layouts/layout';
import withNecessaryUserRoleAuth from '@/hoc/withNecessaryUserRoleAuth';
import HistoryPage from '@/modules/dashboardPage/pages/HistoryPage';
import { UserRole } from '@/types/common';

const History = () => {
  return <HistoryPage></HistoryPage>;
};

History.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withNecessaryUserRoleAuth(History, History.getNestedLayout, [
  UserRole.MEMBER,
  UserRole.ADMIN,
]);
