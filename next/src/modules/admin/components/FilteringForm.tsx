import { Button, Input, Select, Space } from 'antd';
import React, { ChangeEvent } from 'react';

const { Search } = Input;

interface SelectOption<T> {
  value: T;
  label: string;
}

interface Props<T> {
  inputValue: string;
  inputPlaceholder: string;
  selectValue: T[];
  selectOptions: SelectOption<T>[];
  selectPlaceholder: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: T[]) => void;
  onResetFilters: () => void;
}

export const FilteringForm = <T,>({
  inputValue,
  inputPlaceholder,
  selectValue,
  selectOptions,
  selectPlaceholder,
  onInputChange,
  onSelectChange,
  onResetFilters,
}: Props<T>) => {
  return (
    <Space style={{ width: '100%' }}>
      <Search
        style={{ minWidth: 250 }}
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={onInputChange}
        enterButton
      />
      <Select
        mode="multiple"
        style={{ minWidth: 200 }}
        value={selectValue}
        placeholder={selectPlaceholder}
        options={selectOptions}
        onChange={onSelectChange}
      />

      <Button type="primary" onClick={onResetFilters}>
        Reset filters
      </Button>
    </Space>
  );
};
