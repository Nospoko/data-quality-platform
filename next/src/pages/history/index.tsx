import { ReactElement } from 'react';

import withNecessaryUserRoleAuth from '@/components/hoc/withNecessaryUserRoleAuth';
import CustomLayout from '@/components/layouts/layout';
import HistoryDatasetSelect from '@/modules/dashboard/pages/HistoryDatasetSelect';
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
