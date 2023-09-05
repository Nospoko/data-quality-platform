import { Button, Input, Modal, Table, TableColumnsType } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { ChartRanges } from '../../models';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ranges: ChartRanges;
  onChange: (ranges: ChartRanges) => void;
};

type TableData = {
  key: number;
  label: string;
  left: number;
  right: number;
};

const RangesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ranges,
  onChange,
}) => {
  const [tableData, setTableData] = useState<TableData[]>(() =>
    Object.entries(ranges).map(([label, range], index) => ({
      key: index,
      label,
      left: range[0],
      right: range[1],
    })),
  );
  const [rangesCount, setRangesCount] = useState(tableData.length);

  const handleChangeLabel = (index: number) => (newLabel: string) => {
    setTableData((data) =>
      data.map((row) =>
        row.key !== index ? row : { ...row, label: newLabel },
      ),
    );
  };

  const handleChangeNumber =
    (index: number, side: 'left' | 'right') => (newValue: number) => {
      setTableData((data) =>
        data.map((row) =>
          row.key !== index ? row : { ...row, [side]: newValue },
        ),
      );
    };

  const handleDeleteRage = (index: number) => () => {
    setTableData((data) => data.filter((row) => row.key !== index));
  };

  const columns: TableColumnsType<TableData> = [
    {
      title: 'Label',
      dataIndex: 'label',
      width: '30%',
      render: (_, row) => (
        <EditableLabel
          value={row.label}
          onChange={handleChangeLabel(row.key)}
        />
      ),
    },
    {
      title: 'Left boundary',
      dataIndex: 'left',
      render: (_, row) => (
        <EditableNumber
          value={row.left}
          onChange={handleChangeNumber(row.key, 'left')}
        />
      ),
    },
    {
      title: 'Right Boundary',
      dataIndex: 'right',
      render: (_, row) => (
        <EditableNumber
          value={row.right}
          onChange={handleChangeNumber(row.key, 'right')}
        />
      ),
    },
    {
      title: '',
      render: (_, row) => (
        <Button
          size="small"
          style={{ color: 'red' }}
          onClick={handleDeleteRage(row.key)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleAddNewRange = () => {
    setTableData((data) => [
      ...data,
      { key: rangesCount, label: `Range ${++data.length}`, left: 0, right: 0 },
    ]);
    setRangesCount((x) => ++x);
  };

  const handleSave = () => {
    const newRanges = tableData.reduce((acc: ChartRanges, row) => {
      acc[row.label] = [row.left, row.right];
      return acc;
    }, {});

    onChange(newRanges);
    onClose();
  };

  return (
    <Modal centered open={isOpen} onCancel={onClose} width={600} footer={null}>
      <ModalBody>
        <Table columns={columns} dataSource={tableData} />

        <ButtonsWrapper>
          <Button onClick={handleAddNewRange}>+ Add Range</Button>
          <Button onClick={handleSave}>Save</Button>
        </ButtonsWrapper>
      </ModalBody>
    </Modal>
  );
};

const EditableLabel: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
}> = ({ value, onChange }) => (
  <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
);

const EditableNumber: React.FC<{
  value: number;
  onChange: (newValue: number) => void;
}> = ({ value, onChange }) => (
  <Input
    type="number"
    step={0.01}
    value={value}
    onChange={(e) => onChange(+e.target.value)}
  />
);

const ModalBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 26px 0 26px 0;

  display: flex;
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default RangesModal;
