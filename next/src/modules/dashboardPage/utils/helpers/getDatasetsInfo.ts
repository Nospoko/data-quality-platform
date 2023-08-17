import { Dataset } from '@/lib/orm/entity/Dataset';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { User } from '@/lib/orm/entity/User';
import { DatasetInfo } from '@/types/common';

export const getDatasetsInfo = (userData: User): DatasetInfo[] => {
  const uniqueDatasetsMap = new Map<string, Dataset>();

  userData?.organizationMemberships.forEach(
    (membership: OrganizationMembership) => {
      membership.organization.datasetAccess.forEach((access) => {
        uniqueDatasetsMap.set(access.dataset.id, access.dataset);
      });
    },
  );

  const datasets = Array.from(uniqueDatasetsMap.values());

  const datasetsInfo = datasets.map((dataset: Dataset) => {
    const foundOrganizations = userData?.organizationMemberships
      .filter((membership: OrganizationMembership) =>
        membership.organization.datasetAccess.some(
          (access) => access.dataset.id === dataset.id,
        ),
      )
      .map((membership) => ({
        id: membership.organization.id,
        name: membership.organization.name,
      }));

    return {
      ...dataset,
      organizations: foundOrganizations,
    };
  });

  return datasetsInfo;
};
