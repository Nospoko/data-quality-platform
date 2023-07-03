import { Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { styled } from 'styled-components';

const HomePage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <div>
      {loading && (
        <StateWrapper>
          <Spin size="large" />
        </StateWrapper>
      )}
    </div>
  );
};

const StateWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
`;

export default HomePage;
