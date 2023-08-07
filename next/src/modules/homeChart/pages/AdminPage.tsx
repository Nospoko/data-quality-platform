import { ClusterOutlined, TeamOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Divider, Layout, Tabs } from 'antd';
import React, { useCallback } from 'react';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import OrganizationsTab from '@/modules/adminPage/OrganizationsTab';
import UsersTab from '@/modules/adminPage/UsersTab';
import {
  changeOrganization,
  createOrganization,
  fetchAllDatasets,
  fetchAllUsers,
  fetchOrganizationNames,
  fetchOrganizations,
  removeDatasetAccess,
  removeOrganization,
  removeOrganizationMembership,
} from '@/services/reactQueryFn';
import { OrganizationDataResponse } from '@/types/common';

interface CreateOrganizationArgs {
  newOrganizationName: string;
  selectedUsers: string[];
  selectedDatasets: string[];
}

const AdminPage = () => {
  const queryClient = useQueryClient();

  // Fetch all organizations
  const { data: organizationsData } = useQuery<OrganizationDataResponse, Error>(
    ['organizations'],
    () => fetchOrganizations(),
  );

  const organizationNames =
    organizationsData?.data?.map((org) => org.name) || [];
  // Fetch all Users
  const { data: users = [] } = useQuery<User[], Error>(
    ['users'],
    fetchAllUsers,
  );

  // Fetch all Datasets
  const { data: datasets = [] } = useQuery<Dataset[], Error>(
    ['datasets'],
    fetchAllDatasets,
  );

  const createOrganizationMutation = useMutation(
    ({
      newOrganizationName,
      selectedUsers,
      selectedDatasets,
    }: CreateOrganizationArgs) =>
      createOrganization(newOrganizationName, selectedUsers, selectedDatasets),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['organizations']);
        queryClient.invalidateQueries(['organizationNames']);
      },
    },
  );

  const removeOrganizationMutation = useMutation(
    (id: string) => removeOrganization(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['organizations']);
        queryClient.invalidateQueries(['organizationNames']);
      },
      onError: (error) => {
        console.error('Mutation Error:', error);
      },
    },
  );

  const createNewOrganization = useCallback(
    async ({
      name,
      selectedUsers,
      selectedDatasets,
    }: {
      name: string;
      selectedUsers: string[];
      selectedDatasets: string[];
    }) => {
      if (!name.trim()) {
        return;
      }

      try {
        await createOrganizationMutation.mutateAsync({
          newOrganizationName: name,
          selectedUsers,
          selectedDatasets,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [createOrganizationMutation],
  );

  const deleteOrganization = useCallback(
    async (id: string) => {
      if (!id) {
        return;
      }

      try {
        await removeOrganizationMutation.mutateAsync(id);
      } catch (error) {
        console.log(error);
      }
    },
    [removeOrganizationMutation],
  );

  const addToOrganization = useCallback(
    async (
      organizationId: string,
      userIds?: string[],
      datasetIds?: string[],
      newName?: string,
    ) => {
      if (!organizationId) {
        return;
      }

      if (!userIds && !datasetIds && !newName?.trim()) {
        return;
      }

      try {
        await changeOrganization(organizationId, userIds, datasetIds, newName);

        queryClient.invalidateQueries(['organizations']);
        queryClient.invalidateQueries(['organizationNames']);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const deleteMembership = useCallback(
    async (userId: string, organizationId: string) => {
      if (!userId || !organizationId) {
        return;
      }

      try {
        await removeOrganizationMembership(userId, organizationId);

        queryClient.invalidateQueries(['organizations']);
        queryClient.invalidateQueries(['organizationNames']);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const deleteDatasetAccess = useCallback(
    async (datasetId: string, organizationId: string) => {
      if (!datasetId || !organizationId) {
        return;
      }

      try {
        await removeDatasetAccess(datasetId, organizationId);

        queryClient.invalidateQueries(['organizations']);
        queryClient.invalidateQueries(['organizationNames']);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  return (
    <Layout>
      <Tabs
        defaultActiveKey="1"
        centered
        size="middle"
        type="card"
        items={[
          {
            key: '1',
            label: (
              <>
                <ClusterOutlined />
                Organizations
              </>
            ),
            children: (
              <OrganizationsTab
                organizationNames={organizationNames || []}
                organizationsData={organizationsData}
                allUsers={users}
                allDatasets={datasets}
                onCreateOrganization={createNewOrganization}
                onDeleteOrganization={deleteOrganization}
                onDeleteMembership={deleteMembership}
                onDeleteDatasetAccess={deleteDatasetAccess}
                onAddData={addToOrganization}
              />
            ),
          },
          {
            key: '2',
            label: (
              <>
                <TeamOutlined />
                Users
              </>
            ),
            children: <UsersTab />,
          },
        ]}
      />

      <Divider />
    </Layout>
  );
};

export default AdminPage;
