import axios from 'axios';

import axiosApi from './axios';

import { Organization } from '@/lib/orm/entity/Organization';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import {
  EcgFragment,
  Filter,
  HistoryDataResponse,
  OrganizationDataResponse,
  RecordsResponse,
} from '@/types/common';

export const getFragment = async (
  exam_uuid: string,
  position: number,
): Promise<EcgFragment> => {
  const { data } = await axiosApi.get<EcgFragment>(
    `data?exam_uid=${exam_uuid}&position=${position}`,
  );
  return data;
};

export const fetchRecords = async (
  skip: number,
  filters: Filter,
  limit = 5,
): Promise<RecordsResponse> => {
  const { exams } = filters;
  const response = await axios.get('/api/records/list', {
    params: {
      skip,
      exams,
      limit,
    },
  });

  return response.data;
};

export const sendFeedback = async ({
  id,
  choice,
}: {
  id: string;
  choice: string;
}): Promise<RecordsResponse> => {
  const response = await axios.post('/api/data-check', {
    id,
    choice,
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

export const fetchExamIds = async (): Promise<string[]> => {
  const response = await axios.get('/api/filters');

  return response.data;
};

export const fetchOrganizations = async (
  lastId?: string,
  names?: string[],
  limit = 10,
): Promise<OrganizationDataResponse> => {
  const response = await axios.get('/api/organizations', {
    params: {
      lastId,
      names,
      limit,
    },
  });

  return response.data;
};

export const fetchOrganizationNames = async (): Promise<string[]> => {
  const response = await axios.get('/api/organizations', {
    params: {
      onlyNames: true,
    },
  });

  return response.data;
};

export const createOrganization = async (
  name: string,
): Promise<Organization> => {
  const response = await axios.post('/api/organizations', { name });

  return response.data;
};

export const changeOrganization = async (
  id: string,
  newName: string,
): Promise<Organization> => {
  const response = await axios.patch('/api/organizations', {
    id,
    newName,
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
  organizationId: string,
): Promise<OrganizationMembership> => {
  const response = await axios.post('/api/memberships', {
    userId,
    organizationId,
  });

  return response.data;
};

export const changeOrganizationMembership = async (
  memberShipId: string,
  newOrganizationId: string,
): Promise<OrganizationMembership> => {
  const response = await axios.patch('/api/memberships', {
    memberShipId,
    newOrganizationId,
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
