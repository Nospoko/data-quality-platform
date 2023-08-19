import { ReactElement } from 'react';

import CustomLayout from '@/components/layouts/layout';
import withNecessaryUserRoleAuth from '@/hoc/withNecessaryUserRoleAuth';
import HistoryDatasetSelect from '@/modules/dashboardPage/pages/HistoryDatasetSelect';
import { UserRole } from '@/types/common';

const HistoryIndex = () => {
  return <HistoryDatasetSelect></HistoryDatasetSelect>;
};

HistoryIndex.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withNecessaryUserRoleAuth(
  HistoryIndex,
  HistoryIndex.getNestedLayout,
  [UserRole.MEMBER, UserRole.ADMIN],
  '/guide',
);
