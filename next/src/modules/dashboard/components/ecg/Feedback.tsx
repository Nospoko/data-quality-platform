import {
  CheckOutlined,
  CloseOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { styled } from 'styled-components';

import { Choice } from '@/lib/orm/entity/DataCheck';

const ButtonStyle: React.CSSProperties = {
  height: '30%',
  width: '100%',
};

type Props = {
  isZoomView?: boolean;
  onOpenZoomView?: () => void;
  decision?: Choice;
  handleSelect: (choice: Choice) => void;
  isFetching: boolean;
  children?: React.ReactNode;
};
const Feedback: React.FC<Props> = ({
  onOpenZoomView,
  handleSelect,
  decision,
  isFetching,
  children,
}) => {
  const isApproved = decision === Choice.APPROVED;

  return (
    <Wrapper>
      <Button
        style={{
          ...ButtonStyle,
          color: isApproved ? 'white' : 'green',
          backgroundColor: isApproved ? 'green' : 'transparent',
          border: '1px solid green',
        }}
        type="primary"
        ghost={decision !== Choice.APPROVED}
        size="large"
        icon={<CheckOutlined />}
        onClick={() => handleSelect(Choice.APPROVED)}
        disabled={isFetching}
      ></Button>

      {/* 
      <Button
        style={ButtonStyle}
        type="primary"
        ghost={decision !== Choice.REJECTED}
        danger
        size="large"
        onClick={() => handleSelect(Choice.REJECTED)}
        icon={<CloseOutlined />}
        disabled={isFetching}
      ></Button>

      <Button
        style={ButtonStyle}
        type="primary"
        ghost={decision !== Choice.UNKNOWN}
        size="large"
        onClick={() =>
          onOpenZoomView ? onOpenZoomView() : handleSelect(Choice.UNKNOWN)
        }
        icon={<QuestionOutlined />}
        disabled={isFetching}
      ></Button>
      */}

      {children}
    </Wrapper>
  );
};

export default Feedback;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 160px;
  height: 100%;
  width: 100%;
`;
