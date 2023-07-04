import axios from 'axios';

import axiosApi from './axios';

import { Record } from '@/lib/orm/entity/Record';
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
