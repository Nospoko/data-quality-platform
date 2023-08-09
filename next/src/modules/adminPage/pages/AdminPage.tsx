import { ClusterOutlined, TeamOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Divider, Layout, Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import OrganizationsTab from '@/modules/adminPage/components/OrganizationsTab';
import UsersTab from '@/modules/adminPage/components/UsersTab';
import {
  changeOrganization,
  changeUsersRole,
  createOrganization,
  createOrganizationMembership,
  fetchAllDatasets,
  fetchAllUsers,
  fetchOrganizations,
  removeDatasetAccess,
  removeOrganization,
  removeOrganizationMembership,
} from '@/services/reactQueryFn';
import {
  CreateOrganizationArgs,
  OrganizationDataResponse,
} from '@/types/common';

const AdminPage = () => {
  const [activeTabKey, setActiveTabKey] = useState(
    localStorage.getItem('activeTabKey') || '1',
  );
  const queryClient = useQueryClient();

  const { data: organizationsData } = useQuery<OrganizationDataResponse, Error>(
    ['organizations'],
    () => fetchOrganizations(),
  );

  const organizationNames =
    organizationsData?.data?.map((org) => org.name) || [];

  const { data: users = [] } = useQuery<User[], Error>(
    ['users'],
    fetchAllUsers,
  );

  const { data: datasets = [] } = useQuery<Dataset[], Error>(
    ['datasets'],
    fetchAllDatasets,
  );

  const invalidateData = () => {
    queryClient.invalidateQueries(['users']);
    queryClient.invalidateQueries(['organizations']);
    queryClient.invalidateQueries(['organizationNames']);
  };

  const createNewOrganization = useCallback(
    async ({
      newOrganizationName,
      selectedUsers,
      selectedDatasets,
    }: CreateOrganizationArgs) => {
      if (!newOrganizationName.trim()) {
        return;
      }

      try {
        await createOrganization(
          newOrganizationName,
          selectedUsers,
          selectedDatasets,
        );

        invalidateData();
      } catch (error) {
        console.log(error);
      }
    },
    [organizationsData],
  );

  const deleteOrganization = useCallback(
    async (id: string) => {
      if (!id) {
        return;
      }

      try {
        await removeOrganization(id);

        invalidateData();
      } catch (error) {
        console.log(error);
      }
    },
    [organizationsData],
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

        invalidateData();
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const addUserToOrganizations = useCallback(
    async (userId: string, organizationIds: string[]) => {
      if (!userId) {
        return;
      }

      try {
        await createOrganizationMembership(userId, organizationIds);

        invalidateData();
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

        invalidateData();
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

        invalidateData();
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const changeRole = useCallback(async (userId: string, role: string) => {
    if (!userId) {
      return;
    }

    try {
      await changeUsersRole(userId, role);

      queryClient.invalidateQueries(['users']);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);

    localStorage.setItem('activeTabKey', key);
  };

  useEffect(() => {
    localStorage.setItem('activeTabKey', activeTabKey);
  }, [activeTabKey]);

  return (
    <Layout>
      <Tabs
        defaultActiveKey={activeTabKey}
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
            children: (
              <UsersTab
                users={users}
                allOrganizations={organizationsData?.data || []}
                onAddOrganizations={addUserToOrganizations}
                onDeleteMembership={deleteMembership}
                onChangeRole={changeRole}
              />
            ),
          },
        ]}
        onChange={handleTabChange}
      />

      <Divider />
    </Layout>
  );
};

export default AdminPage;
