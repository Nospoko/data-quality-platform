import { ReactElement } from 'react';

import CustomLayout from '@/components/layouts/layout';
import HistoryPage from '@/modules/dashboardPage/pages/HistoryPage';

const History = () => {
  return <HistoryPage></HistoryPage>;
};

History.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default History;
