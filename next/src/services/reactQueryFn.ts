import axios from 'axios';

import axiosApi from './axios';

import { EcgFragment, RecordsResponse } from '@/types/common';

export const getFragment = async (id: number): Promise<EcgFragment> => {
  const { data } = await axiosApi.get<EcgFragment>(`/record/${id}`);
  return data;
};

export const fetchRecords = async (
  page: number,
  limit: number,
): Promise<RecordsResponse> => {
  const response = await axios.get('/api/records/list', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const sendFeedback = async ({
  index,
  choice,
}: {
  index: number;
  choice: string;
}): Promise<RecordsResponse> => {
  const response = await axios.post('/api/data-check', {
    index,
    choice,
  });

  return response.data;
};