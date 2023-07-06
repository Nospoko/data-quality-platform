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
  handleSelect: (choice: Choice) => void;
};
const Feedback: React.FC<Props> = ({ handleSelect }) => {
  return (
    <Wrapper>
      <Button
        type="primary"
        ghost
        size="large"
        icon={<CheckOutlined />}
        onClick={() => handleSelect(Choice.APPROVED)}
      ></Button>
      <Button
        type="primary"
        ghost
        danger
        size="large"
        onClick={() => handleSelect(Choice.REJECTED)}
        icon={<CloseOutlined />}
      ></Button>
      <Button
        type="primary"
        ghost
        size="large"
        disabled
        icon={<QuestionOutlined />}
      ></Button>
    </Wrapper>
  );
};

export default Feedback;

const Wrapper = styled.div`
  padding: 40px 0;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
