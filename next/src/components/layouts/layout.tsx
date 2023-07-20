import { Button, Layout } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import CustomHeader from '../Header';

const { Header, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  margin: '0 auto',
  maxWidth: 1400,
  height: '100vh',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  backgroundColor: '#fff',
};

const contentStyle: React.CSSProperties = {
  padding: '50px',
  backgroundColor: '#fff',
};

const CustomLayout = ({ children }: { children: JSX.Element }) => {
  const { status } = useSession();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <CustomHeader />
      </Header>

      <Content style={contentStyle}>
        {status === 'unauthenticated' ? (
          <h1>Please sign in</h1>
        ) : (
          <>
            {children}
            {showTopBtn && (
              <ButtonWrapper>
                <StyledButton type="primary" danger onClick={handleScrollToTop}>
                  Top
                </StyledButton>
              </ButtonWrapper>
            )}
          </>
        )}
      </Content>
    </Layout>
  );
};

export default CustomLayout;

const ButtonWrapper = styled.div`
  position: fixed;
  left: 16px;
  bottom: 80px;
`;

const StyledButton = styled(Button)`
  &&& {
    display: flex;
    justify-content: center;
    align-item: center;
    height: 36px;
    width: 40px;
  }
`;
