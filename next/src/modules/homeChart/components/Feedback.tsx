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
      />

      <StyledButton
        type="primary"
        ghost
        danger
        size="large"
        onClick={() => handleSelect(Choice.REJECTED)}
        icon={<CloseOutlined />}
      />

      <StyledButton
        type="primary"
        ghost
        size="large"
        onClick={() =>
          onOpenZoomView ? onOpenZoomView() : handleSelect(Choice.UNKNOWN)
        }
        icon={<QuestionOutlined />}
      />
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
