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
  left: number;
  right: number;
};

const possibleRanges = ['P', 'Q', 'R', 'S', 'T', 'X'];

const rangesToTableData = (ranges: ChartRanges) =>
  Object.entries(ranges).map(([label, range]) => ({
    key: label,
    label,
    left: range[0],
    right: range[1],
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
  const [xRangesCount, setXRangesCount] = useState(0);
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
      setXRangesCount((x) => ++x);
      setTableData((data) => [
        ...data,
        {
          key: `X${xRangesCount + 1}`,
          label: `X${xRangesCount + 1}`,
          left: 0,
          right: 0,
        },
      ]);
    } else {
      setTableData((data) => [
        ...data,
        { key: label, label, left: 0, right: 0 },
      ]);
    }

    setIsAddPopoverOpen(false);
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
