import {
  ClusterOutlined,
  DatabaseOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Divider, Layout, Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import DatasetTab from '../components/DatasetTab';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import OrganizationsTab from '@/modules/admin/components/OrganizationsTab';
import UsersTab from '@/modules/admin/components/UsersTab';
import {
  changeDatasetIsActiveStatus,
  changeDatasetName,
  changeOrganization,
  changeUsersRole,
  createNewDataset,
  createOrganization,
  createOrganizationMembership,
  fetchAllDatasets,
  fetchAllUsers,
  fetchOrganizations,
  removeDataset,
  removeDatasetAccess,
  removeOrganization,
  removeOrganizationMembership,
  syncDatasets,
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
    queryClient.invalidateQueries(['datasets']);
    queryClient.invalidateQueries(['organizations']);
    queryClient.invalidateQueries(['organizationNames']);
  };

  const createNewOrganization = useCallback(
    async ({
      name,
      selectedUsers,
      selectedDatasets,
    }: CreateOrganizationArgs) => {
      if (!name.trim()) {
        return;
      }

      try {
        await createOrganization(name, selectedUsers, selectedDatasets);

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

  // Create a new dataset
  const createDataset = useCallback(async (name: string) => {
    if (!name) {
      return;
    }

    try {
      await createNewDataset(name);

      queryClient.invalidateQueries(['datasets']);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Change a name of dataset by dataset id
  const changeNameDataset = useCallback(
    async (datasetId: string, newName: string) => {
      if (!datasetId || !newName) {
        return;
      }

      try {
        await changeDatasetName(datasetId, newName);

        invalidateData();
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  // Changing dataset status
  const changeDatasetStatus = async (datasetId: string, isActive: boolean) => {
    if (!datasetId || isActive === undefined) {
      return;
    }

    try {
      await changeDatasetIsActiveStatus(datasetId, isActive);

      invalidateData();
    } catch (error) {
      console.error(error);
    }
  };

  // Remove selected dataset
  const deleteDataset = useCallback(async (datasetId: string) => {
    if (!datasetId) {
      return;
    }

    try {
      await removeDataset(datasetId);

      invalidateData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Synchronize datasets
  const synchronizeDatasets = async () => {
    try {
      const normalizeDatasets = datasets.map((dataset) => ({
        dataset_name: dataset.name,
        state: dataset.isActive ? 'active' : 'inactive',
      }));

      await syncDatasets(normalizeDatasets);
    } catch (error) {
      console.error(error);
    }
  };

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
          {
            key: '3',
            label: (
              <>
                <DatabaseOutlined />
                Datasets
              </>
            ),
            children: (
              <DatasetTab
                datasets={datasets}
                onCreateNewDataset={createDataset}
                onChangeStatus={changeDatasetStatus}
                onChangeDatasetName={changeNameDataset}
                onDeleteDataset={deleteDataset}
                onSync={synchronizeDatasets}
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
