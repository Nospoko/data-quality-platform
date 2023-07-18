import { Breadcrumb, Button, Layout } from 'antd';
import { useRouter } from 'next/router';
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
  padding: '0 50px',
  backgroundColor: '#fff',
};

const CustomLayout = ({ children }: { children: JSX.Element }) => {
  const { status } = useSession();
  const router = useRouter();
  const { pathname } = router;
  const normalizedPath = pathname === '/' ? 'home' : pathname.slice(1);
  const [opened, setOpened] = useState(normalizedPath);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    setOpened(normalizedPath);
  }, [router]);

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

  if (status === 'unauthenticated') {
    return <h1>Please sign in</h1>;
  }

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <CustomHeader />
      </Header>

      <Content style={contentStyle}>
        <Breadcrumb style={{ margin: '16px 0', textTransform: 'capitalize' }}>
          <Breadcrumb.Item>{opened}/</Breadcrumb.Item>
        </Breadcrumb>

        {children}

        {showTopBtn && (
          <ButtonWrapper>
            <StyledButton type="primary" danger onClick={handleScrollToTop}>
              Top
            </StyledButton>
          </ButtonWrapper>
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
