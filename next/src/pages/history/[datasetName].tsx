import { ReactElement } from 'react';

import withNecessaryUserRoleAuth from '@/components/hoc/withNecessaryUserRoleAuth';
import CustomLayout from '@/components/layouts/layout';
import HistoryPage from '@/modules/dashboard/pages/HistoryPage';
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
