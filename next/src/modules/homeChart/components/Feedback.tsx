import {
  CheckOutlined,
  CloseOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { styled } from 'styled-components';

import { Choice } from '@/lib/orm/entity/DataCheck';

type Props = {
  isZoomView?: boolean;
  onOpenZoomView?: () => void;
  decision?: Choice;
  handleSelect: (choice: Choice) => void;
};
const Feedback: React.FC<Props> = ({
  onOpenZoomView,
  handleSelect,
  decision,
}) => {
  return (
    <Wrapper>
      <StyledButton
        type="primary"
        ghost={decision !== Choice.APPROVED}
        size="large"
        icon={<CheckOutlined />}
        onClick={() => handleSelect(Choice.APPROVED)}
      ></StyledButton>

      <StyledButton
        type="primary"
        ghost={decision !== Choice.REJECTED}
        danger
        size="large"
        onClick={() => handleSelect(Choice.REJECTED)}
        icon={<CloseOutlined />}
      ></StyledButton>

      <StyledButton
        type="primary"
        ghost={decision !== Choice.UNKNOWN}
        size="large"
        onClick={() =>
          onOpenZoomView ? onOpenZoomView() : handleSelect(Choice.UNKNOWN)
        }
        icon={<QuestionOutlined />}
      ></StyledButton>
    </Wrapper>
  );
};

export default Feedback;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const StyledButton = styled(Button)`
  &&& {
    height: 30%;
    width: 100%;
  }
`;
