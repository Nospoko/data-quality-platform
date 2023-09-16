import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

import { fetchFilters, MetadataField } from '@/services/reactQueryFn';
import { Filter } from '@/types/common';

interface Props {
  onChangeFilter: Dispatch<SetStateAction<Filter>>;
  filterValue: MetadataField;
}

const SearchingForm: React.FC<Props> = ({ onChangeFilter, filterValue }) => {
  const { data: filters } = useQuery(['filters'], () =>
    fetchFilters(filterValue),
  );

  return (
    <div>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select a filter..."
        onChange={(selected: string[]) => {
          onChangeFilter({ filterValues: selected });
        }}
      >
        {filters &&
          filters.map((v) => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
      </Select>
    </div>
  );
};

export default SearchingForm;
