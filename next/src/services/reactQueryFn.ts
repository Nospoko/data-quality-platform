import axios from 'axios';

import axiosApi from './axios';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { Organization } from '@/lib/orm/entity/Organization';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { User } from '@/lib/orm/entity/User';
import {
  EcgFragment,
  Filter,
  HistoryDataResponse,
  OrganizationDataResponse,
  RecordsResponse,
} from '@/types/common';

// I added a new parameter called datasetName of type string to the function getFragment.
// This parameter represents the name of selected dataset.
export const getFragment = async (
  exam_uuid: string,
  position: number,
  datasetName: string,
): Promise<EcgFragment> => {
  const { data } = await axiosApi.get<EcgFragment>(
    `data?exam_uid=${exam_uuid}&position=${position}&dataset_name=${datasetName}`,
  );
  return data;
};

export const fetchRecords = async (
  filters: Filter,
  limit = 5,
): Promise<RecordsResponse> => {
  const { exams } = filters;
  const response = await axios.get('/api/records/list', {
    params: {
      exams,
      limit,
    },
  });

  return response.data;
};

export type MidiFeedback = {
  comment?: string;
  rhythm?: number;
  quality?: number;
};
export const sendFeedback = async ({
  id,
  choice,
  comment,
  rhythm,
  quality,
}: {
  id: string;
  choice?: string;
} & MidiFeedback): Promise<RecordsResponse> => {
  const response = await axios.post('/api/data-check', {
    id,
    choice,
    comment,
    rhythm,
    quality,
  });

  return response.data;
};

export const fetchUserRecords = async (
  skip: number,
  filters: Filter,
  limit = 5,
): Promise<HistoryDataResponse> => {
  const { exams } = filters;
  const response = await axios.get('/api/records/history', {
    params: {
      skip,
      exams,
      limit,
    },
  });

  return response.data;
};

export const changeChoice = async ({
  dataCheckId,
  choice,
}: {
  dataCheckId: string;
  choice: string;
}): Promise<RecordsResponse> => {
  const response = await axios.patch('/api/data-check', {
    dataCheckId,
    choice,
  });

  return response.data;
};

export const changeMidiFeedback = async ({
  dataCheckId,
  comment,
  rhythm,
  quality,
}: {
  dataCheckId: string;
  comment: string;
  rhythm: number;
  quality: number;
}): Promise<RecordsResponse> => {
  const response = await axios.patch('/api/data-check', {
    dataCheckId,
    rhythm,
    quality,
    comment,
  });

  return response.data;
};

export const fetchExamIds = async (): Promise<string[]> => {
  const response = await axios.get('/api/filters');

  return response.data;
};

export const fetchOrganizations =
  async (): Promise<OrganizationDataResponse> => {
    const response = await axios.get('/api/organizations');

    return response.data;
  };

export const createOrganization = async (
  name: string,
  selectedUsers: string[],
  selectedDatasets: string[],
): Promise<Organization> => {
  const response = await axios.post('/api/organizations', {
    name,
    userIds: selectedUsers,
    datasetIds: selectedDatasets,
  });

  return response.data;
};

export const changeOrganization = async (
  id: string,
  userIds?: string[],
  datasetIds?: string[],
  newName?: string,
): Promise<Organization> => {
  const response = await axios.patch('/api/organizations', {
    id,
    newName,
    userIds,
    datasetIds,
  });

  return response.data;
};

export const removeOrganization = async (id: string): Promise<Organization> => {
  const response = await axios.delete('/api/organizations', {
    params: {
      id,
    },
  });

  return response.data;
};

export const createOrganizationMembership = async (
  userId: string,
  organizationIds: string[],
): Promise<OrganizationMembership> => {
  const response = await axios.post('/api/memberships', {
    userId,
    organizationIds,
  });

  return response.data;
};

export const removeOrganizationMembership = async (
  userId: string,
  organizationId: string,
) => {
  const response = await axios.delete('/api/memberships', {
    params: {
      userId,
      organizationId,
    },
  });

  return response.data;
};

export const fetchAllUsers = async () => {
  const response = await axios.get('/api/users');

  return response.data;
};

export const changeUsersRole = async (userId: string, role: string) => {
  const response = await axios.patch('/api/users', {
    userId,
    role,
  });

  return response.data;
};

export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await axios.get('/api/users', {
    params: {
      userId,
    },
  });

  return response.data;
};

export const fetchAllDatasets = async () => {
  const response = await axios.get('/api/datasets');

  return response.data;
};

export const removeDatasetAccess = async (
  datasetId: string,
  organizationId: string,
) => {
  const response = await axios.delete('/api/dataset-access', {
    params: {
      datasetId,
      organizationId,
    },
  });

  return response.data;
};

// This function sends a POST request to the /api/datasets endpoint with the
// provided dataset name in the request body. It expects the response to
// contain data about the newly created dataset
export const createNewDataset = async (name: string): Promise<Dataset> => {
  const response = await axios.post('/api/datasets', {
    name,
  });

  return response.data;
};

// This function sends a PATCH request to the /api/datasets endpoint to update
// the name of a dataset. It takes the datasetId and newName as parameters and
// expects the response to contain the updated dataset information
export const changeDatasetName = async (datasetId: string, newName: string) => {
  const response = await axios.patch('/api/datasets', {
    datasetId,
    newName,
  });

  return response.data;
};

// This function sends a PATCH request to the /api/datasets endpoint to update
// the status (active or not active) of a dataset. It takes the datasetId and
// isActive status as parameters and expects the response to contain
// the updated dataset information
export const changeDatasetIsActiveStatus = async (
  datasetId: string,
  isActive: boolean,
) => {
  const response = await axios.patch('/api/datasets', {
    datasetId,
    isActive,
  });

  return response.data;
};

// This function sends a DELETE request to the /api/datasets endpoint to delete a dataset.
// It takes the datasetId as a parameter and expects a successful response with no data
export const removeDataset = async (datasetId: string) => {
  const response = await axios.delete('/api/datasets', {
    params: {
      datasetId,
    },
  });

  return response.data;
};

// This function sends a POST request to the /datasets endpoint to synchronize datasets.
// It takes an array of datasets names and statuses  as parameters,
// and expects the response to contain data related to the synchronization process
export const syncDatasets = async (
  datasets: { dataset_name: string; state: string }[],
) => {
  const response = await axiosApi.post('/datasets', {
    datasets,
  });

  return response.data;
};
