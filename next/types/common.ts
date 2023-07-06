import { Record } from '@/lib/orm/entity/Record';

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export type EcgFragment = {
  time: string;
  label: string;
  position: number;
  is_beat: boolean;
  signal: number[][];
  exam_uid: string;
};

export type RecordsResponse = {
  data: Record[];
  total: number;
  page: number;
  limit: number;
};
