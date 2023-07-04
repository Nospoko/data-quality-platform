import { Layout } from 'antd';
import React from 'react';

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

const CustomLayout = ({ children }: { children: JSX.Element }) => (
  <Layout style={layoutStyle}>
    {/* <Header style={headerStyle}>
      <CustomHeader />
    </Header> */}
    <Content style={contentStyle}>{children}</Content>
  </Layout>
);

export default CustomLayout;
