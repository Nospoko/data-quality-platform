import { ChartDataset } from 'chart.js';

import { DataCheck } from '@/lib/orm/entity/DataCheck';
import { DatasetAccess } from '@/lib/orm/entity/DatasetAccess';
import { OrganizationMembership } from '@/lib/orm/entity/OrganizationMembership';
import { Record } from '@/lib/orm/entity/Record';

export type MidiMetadata = {
  midi_filename: string;
};

export type EcgMetadata = {
  exam_uid: string;
  label: 'X' | 'N';
  position: number;
  time: string;
  segments: { [key: string]: [number, number] };
};

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

export type Dataset = ChartDataset<'line', number[]>;

export type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

export type SelectedChartData = {
  id: string;
  fragment: EcgFragment;
  data: ChartData;
  decision?: HistoryData;
};

export type SelectedHistoryChartData = {
  id: number;
  fragment: EcgFragment;
  data?: ChartData;
  decision: HistoryData;
};

export interface HistoryData extends DataCheck {
  record: Record;
}

export type HistoryDataResponse = {
  data: HistoryData[];
  total: number;
  page: number;
  limit: number;
};

export interface Filter {
  filterValues: string[];
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ThemeContextType = {
  isDarkMode: boolean;
  theme: string;
  handleChangeTheme: (state: boolean) => void;
};

export interface OrganizationType {
  id: string;
  name: string;
  organizationMemberships: OrganizationMembership[];
  datasetAccess: DatasetAccess[];
}

export type OrganizationDataResponse = {
  data: OrganizationType[];
  hasNextPage: boolean;
  total: number;
};

export type OnAddParams =
  | { selectedUsers: string[] }
  | { selectedDatasets: string[] }
  | { selectedOrganizations: string[] };

export enum SubTableTypes {
  USERS = 'users',
  MEMBERSHIPS = 'memberships',
  DATASETACCESS = 'datasetAccess',
  ORGANIZATIONS = 'organizations',
}

export enum AddingFormTypes {
  USERS = 'selectedUsers',
  DATASETS = 'selectedDatasets',
  ORGANIZATIONS = 'selectedOrganizations',
}

export type DatasetInfo = {
  organizations: {
    id: string;
    name: string;
  }[];
  id: string;
  name: string;
  isActive: boolean;
};

export interface CreateOrganizationArgs {
  name: string;
  selectedUsers: string[];
  selectedDatasets: string[];
}
