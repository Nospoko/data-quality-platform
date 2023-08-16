import {
  Button,
  ConfigProvider,
  Divider,
  Layout,
  Space,
  theme as themeSettings,
  Typography,
} from 'antd';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import CustomHeader from '../Header';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { ThemeType } from '@/types/common';

const { Header, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  margin: '0 auto',
  maxWidth: 1400,
  width: '100%',
};

const CustomLayout = ({ children }: { children: JSX.Element }) => {
  const [mounted, setMounted] = useState(false);

  const { defaultAlgorithm, darkAlgorithm } = themeSettings;
  const { isDarkMode, theme } = useTheme();

  const { status } = useSession();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    setMounted(true);

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

  return mounted ? (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: isDarkMode ? '#141414' : '#fff',
          colorText: isDarkMode ? '#fff' : '#000',
        },
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Layout>
          <Layout
            style={{
              ...layoutStyle,
            }}
          >
            <HeaderContainer color={theme}>
              <CustomHeader />
            </HeaderContainer>

            <Divider style={{ margin: '0 0 30px 0' }} />

            <Wrapper>
              <ContentWrapper>
                {status === 'unauthenticated' ? (
                  <Typography.Title
                    style={{ textAlign: 'center', height: '100vh' }}
                  >
                    Please, sign in
                  </Typography.Title>
                ) : (
                  <>
                    {children}
                    {showTopBtn && (
                      <ButtonWrapper>
                        <Button
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '36px',
                            width: '40px',
                          }}
                          type="primary"
                          danger
                          onClick={handleScrollToTop}
                        >
                          Top
                        </Button>
                      </ButtonWrapper>
                    )}
                  </>
                )}
              </ContentWrapper>
            </Wrapper>
          </Layout>
        </Layout>
      </Space>
    </ConfigProvider>
  ) : null;
};

export default CustomLayout;

const Wrapper = styled.div`
  max-width: 1400px;
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;

  box-sizing: content-box;
`;

const ContentWrapper = styled(Content)`
  padding: 0 12px;

  @media (min-width: 744px) {
    padding: 0 50px;
  }
`;

const HeaderContainer = styled(Header)`
  width: 100%;
  background-color: ${(props) =>
    props.color === ThemeType.DARK ? '#282828' : '#fff'};
`;

const ButtonWrapper = styled.div`
  position: fixed;
  left: 16px;
  bottom: 80px;
`;
