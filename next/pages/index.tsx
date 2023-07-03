import { ReactElement } from 'react';
import CustomLayout from '@/components/layouts/layout';
import HomePage from '../modules/homeChart/pages/HomePage';

const Home = () => {
  return <HomePage />;
};

Home.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default Home;
