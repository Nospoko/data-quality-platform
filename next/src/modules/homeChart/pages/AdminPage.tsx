import { ClusterOutlined, TeamOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Divider, Layout, Tabs } from 'antd';
import React, { useCallback, useState } from 'react';

import OrganizationsTab from '@/modules/adminPage/OrganizationsTab';
import UsersTab from '@/modules/adminPage/UsersTab';
import {
  createOrganization,
  fetchOrganizationNames,
  fetchOrganizations,
} from '@/services/reactQueryFn';
import { OrganizationDataResponse } from '@/types/common';

const AdminPage = () => {
  const queryClient = useQueryClient();
  // Fetch ONLY all names of organization
  const { data: organizationNames } = useQuery<string[], Error>(
    ['organizationNames'],
    fetchOrganizationNames,
  );

  // Fetch all organizations
  const { data: organizationsData, isLoading: isLoadingOrganizations } =
    useQuery<OrganizationDataResponse, Error>(['organizations'], () =>
      fetchOrganizations(),
    );

  const mutation = useMutation(
    (newOrganizationName: string) => createOrganization(newOrganizationName),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['organizations']);
        queryClient.invalidateQueries(['organizationNames']);
      },
    },
  );

  const createNewOrganization = useCallback(
    async ({ name }: { name: string }) => {
      if (!name.trim()) {
        return;
      }

      try {
        await mutation.mutateAsync(name);
      } catch (error) {
        console.log(error);
      }
    },
    [mutation],
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
                onCreateOrganization={createNewOrganization}
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
