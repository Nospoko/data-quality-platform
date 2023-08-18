import React from 'react';
import styled from 'styled-components';

import SubTable from './SubTable';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { Organization } from '@/lib/orm/entity/Organization';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { User } from '@/lib/orm/entity/User';
import { OrganizationType, SubTableTypes } from '@/types/common';

interface Props {
  typeTab: SubTableTypes;
  data: OrganizationType | OrganizationMembership[];
  allOrganizations?: Organization[];
  userId?: string;
  allUsers?: User[];
  allDatasets?: Dataset[];
  onDeleteMembership: (userId: string, organizationId: string) => void;
  onDeleteDatasetAccess?: (datasetId: string, organizationId: string) => void;
  onAddData: (
    organizationId: string,
    usersIds?: string[],
    datasetIds?: string[],
    newName?: string,
  ) => void | ((userId: string, organizationIds: string[]) => void);
}

export const Accordion: React.FC<Props> = ({
  typeTab,
  data,
  allOrganizations,
  userId,
  allUsers,
  allDatasets,
  onDeleteMembership,
  onDeleteDatasetAccess,
  onAddData,
}) =>
  data && (
    <AccordionWrapper>
      {typeTab === SubTableTypes.ORGANIZATIONS
        ? !Array.isArray(data) &&
          onDeleteDatasetAccess && (
            <>
              <SubTable
                type={SubTableTypes.MEMBERSHIPS}
                data={data.organizationMemberships}
                mainId={data.id}
                allData={allUsers || []}
                onDelete={onDeleteMembership}
                onAddData={onAddData}
              />
              <SubTable
                type={SubTableTypes.DATASETACCESS}
                data={data.datasetAccess}
                mainId={data.id}
                allData={allDatasets || []}
                onDelete={onDeleteDatasetAccess}
                onAddData={onAddData}
              />
            </>
          )
        : userId &&
          allOrganizations && (
            <SubTable
              type={SubTableTypes.ORGANIZATIONS}
              data={data as OrganizationMembership[]}
              mainId={userId}
              allData={allOrganizations}
              onDelete={onDeleteMembership}
              onAddData={onAddData}
            />
          )}
    </AccordionWrapper>
  );

export default Accordion;

const AccordionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 350px;

  @media (min-width: 744px) {
    max-width: 700px;
  }

  @media (min-width: 1000px) {
    max-width: 880px;
  }

  @media (min-width: 1200px) {
    max-width: 1080px;
  }

  @media (min-width: 1400px) {
    max-width: 100%;
  }
`;
