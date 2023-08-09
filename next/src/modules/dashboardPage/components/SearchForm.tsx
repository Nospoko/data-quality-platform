import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

import { fetchExamIds } from '@/services/reactQueryFn';
import { Filter } from '@/types/common';

interface Props {
  onChangeFilter: Dispatch<SetStateAction<Filter>>;
}

const SearchingForm: React.FC<Props> = ({ onChangeFilter }) => {
  const { data: examUids } = useQuery(['examIds'], fetchExamIds);

  return (
    <div>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select Exam UID`..."
        onChange={(selected: string[]) => {
          onChangeFilter({ exams: selected });
        }}
      >
        {examUids &&
          examUids.map((id) => (
            <Select.Option key={id} value={id}>
              {id}
            </Select.Option>
          ))}
      </Select>
    </div>
  );
};

export default SearchingForm;
