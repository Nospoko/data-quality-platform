import React from 'react';

import SubTable from './SubTable';
import { AccordionWrapper } from './TableOrganizations';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import { OrganizationType } from '@/types/common';

interface AccordionOrganizationsProps {
  organization: OrganizationType;
  allUsers: User[];
  allDatasets: Dataset[];
  onDeleteMembership: (userId: string, organizationId: string) => void;
  onDeleteDatasetAccess: (datasetId: string, organizationId: string) => void;
  onAddData: (
    organizationId: string,
    usersIds?: string[],
    datasetIds?: string[],
    newName?: string,
  ) => void;
}
export const AccordionOrganizations: React.FC<AccordionOrganizationsProps> = ({
  organization,
  allUsers,
  allDatasets,
  onDeleteMembership,
  onDeleteDatasetAccess,
  onAddData,
}) => {
  return (
    organization && (
      <AccordionWrapper>
        <SubTable
          type="memberships"
          data={organization.organizationMemberships}
          organizationId={organization.id}
          allData={allUsers}
          onDelete={onDeleteMembership}
          onAddData={onAddData}
        />

        <SubTable
          type="datasetAccess"
          data={organization.datasetAccess}
          organizationId={organization.id}
          allData={allDatasets}
          onDelete={onDeleteDatasetAccess}
          onAddData={onAddData}
        />
      </AccordionWrapper>
    )
  );
};
export default AccordionOrganizations;
