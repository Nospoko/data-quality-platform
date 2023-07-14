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
  handleSelect: (choice: Choice) => void;
};
const Feedback: React.FC<Props> = ({
  isZoomView = false,
  onOpenZoomView,
  handleSelect,
}) => {
  return (
    <Wrapper>
      <StyledButton
        type="primary"
        ghost
        size="large"
        icon={<CheckOutlined />}
        onClick={() => handleSelect(Choice.APPROVED)}
      ></StyledButton>
      <StyledButton
        type="primary"
        ghost
        danger
        size="large"
        onClick={() => handleSelect(Choice.REJECTED)}
        icon={<CloseOutlined />}
      ></StyledButton>

      {!isZoomView && (
        <StyledButton
          type="primary"
          ghost
          size="large"
          onClick={() => onOpenZoomView && onOpenZoomView()}
          icon={<QuestionOutlined />}
        />
      )}
    </Wrapper>
  );
};

export default Feedback;

const Wrapper = styled.div`
  padding: 40px 5px;
  height: 300px;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const StyledButton = styled(Button)`
  &&& {
    height: 60px;
    width: 40px;
  }
`;
