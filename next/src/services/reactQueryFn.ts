import axios from 'axios';

import axiosApi from './axios';

import {
  EcgFragment,
  Filter,
  HistoryDataResponse,
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
