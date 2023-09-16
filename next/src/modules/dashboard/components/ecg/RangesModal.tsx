import {
  Button,
  Input,
  Modal,
  Popover,
  Space,
  Table,
  TableColumnsType,
} from 'antd';
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
  key: string;
  label: string;
  left: string | number;
  right: string | number;
};

const possibleRanges = ['P', 'Q', 'R', 'S', 'T', 'X'];

const rangesToTableData = (ranges: ChartRanges): TableData[] =>
  Object.entries(ranges).map(([label, range]) => ({
    key: label,
    label,
    left: (range[0] / 200).toFixed(2),
    right: (range[1] / 200).toFixed(2),
  }));

const RangesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ranges,
  onChange,
}) => {
  const [tableData, setTableData] = useState<TableData[]>(() =>
    rangesToTableData(ranges),
  );
  const [isAddPopoverOpen, setIsAddPopoverOpen] = useState(false);

  const reset = () => {
    setTableData(rangesToTableData(ranges));
  };

  React.useEffect(reset, [ranges]);

  const onDiscard = () => {
    reset();
    onClose();
  };

  const handleChangeNumber =
    (label: string, side: 'left' | 'right') => (newValue: number) => {
      setTableData((data) =>
        data.map((row) =>
          row.label !== label ? row : { ...row, [side]: newValue },
        ),
      );
    };

  const handleDeleteRage = (label: string) => () => {
    setTableData((data) => data.filter((row) => row.label !== label));
  };

  const columns: TableColumnsType<TableData> = [
    {
      title: 'Label',
      dataIndex: 'label',
      width: '30%',
    },
    {
      title: 'Left boundary',
      dataIndex: 'left',
      render: (_, row) => (
        <EditableNumber
          value={row.left}
          onChange={handleChangeNumber(row.label, 'left')}
        />
      ),
    },
    {
      title: 'Right Boundary',
      dataIndex: 'right',
      render: (_, row) => (
        <EditableNumber
          value={row.right}
          onChange={handleChangeNumber(row.label, 'right')}
        />
      ),
    },
    {
      title: '',
      render: (_, row) => (
        <Button
          size="small"
          style={{ color: 'red' }}
          onClick={handleDeleteRage(row.label)}
          disabled={row.label === 'R'}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleAddNewRange = (label: string) => {
    if (label === 'X') {
      const xIndexes = tableData
        .map(({ key }) =>
          key.startsWith('X') ? parseInt(key.substring(1)) : null,
        )
        .filter(Boolean);
      const nextIndex = xIndexes.length
        ? Math.max(...(xIndexes as number[])) + 1
        : 1;

      setTableData((data) => [
        ...data,
        {
          key: `X${nextIndex}`,
          label: `X${nextIndex}`,
          left: 2.6,
          right: 3.4,
        },
      ]);
    } else {
      setTableData((data) => [
        ...data,
        { key: label, label, left: 2.6, right: 3.4 },
      ]);
    }

    setIsAddPopoverOpen(false);
  };

  const handleSave = () => {
    const newRanges = tableData.reduce((acc: ChartRanges, row) => {
      const left = Math.min(+row.left, +row.right);
      const right = Math.max(+row.left, +row.right);
      acc[row.label] = [left * 200, right * 200];
      return acc;
    }, {});

    onChange(newRanges);
    onClose();
  };

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={onDiscard}
      width={600}
      footer={null}
    >
      <ModalBody>
        <Table columns={columns} dataSource={tableData} />

        <ButtonsWrapper>
          <Popover
            open={isAddPopoverOpen}
            onOpenChange={setIsAddPopoverOpen}
            trigger="click"
            content={
              <Space>
                {possibleRanges.map((label) => {
                  if (
                    label !== 'X' &&
                    tableData.find((r) => r.label === label)
                  ) {
                    return null;
                  }

                  return (
                    <Button
                      key={label}
                      onClick={() => handleAddNewRange(label)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Space>
            }
          >
            <Button>+ Add Range</Button>
          </Popover>
          <Button onClick={handleSave}>Save</Button>
        </ButtonsWrapper>
      </ModalBody>
    </Modal>
  );
};

const EditableNumber: React.FC<{
  value: number | string;
  onChange: (newValue: number) => void;
}> = ({ value, onChange }) => (
  <Input
    type="number"
    step={0.01}
    min={0}
    max={6}
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
