import { ReactElement } from 'react';

import HomePage from '../modules/homeChart/pages/HomePage';

import CustomLayout from '@/components/layouts/layout';

const Home = () => {
  return <HomePage />;
};

Home.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default Home;
