import { ReactElement } from 'react';

import CustomLayout from '@/components/layouts/layout';
import GuidePage from '@/modules/guide/pages/GuidePage';

const Guide = () => {
  return <GuidePage />;
};

Guide.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default Guide;
