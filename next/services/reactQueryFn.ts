import axiosApi from './axios';

import { IFilesResponse } from '@/types/common';

export const getFilesFn = async (userId?: string) => {
  const response = await axiosApi.get<IFilesResponse>(`/files/${userId}`);
  return response.data;
};
