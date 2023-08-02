import { ReactElement } from 'react';

import withAdminAuthorization from '../withAdminAuthorization';

import CustomLayout from '@/components/layouts/layout';
import OrganizationsPage from '@/modules/homeChart/pages/OrganizationsPage';

const Organizations = () => {
  return <OrganizationsPage></OrganizationsPage>;
};

Organizations.getNestedLayout = function getNestedLayout(page: ReactElement) {
  return <CustomLayout>{page}</CustomLayout>;
};

export default withAdminAuthorization(
  Organizations,
  Organizations.getNestedLayout,
);
