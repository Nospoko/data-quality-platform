import {
  HistoryOutlined,
  LineChartOutlined,
  MenuOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';
import { styled } from 'styled-components';

import SignInBtn from './buttons/SignInBtn';
import SignOutBtn from './buttons/SignOutBtn';
import ThemeSwitcher from './buttons/ThemeSwitcher';

import { UserRole } from '@/types/common';

const Header = () => {
  const { data: session } = useSession();
  const userRole = session?.user.role;

  const isAdmin = userRole === UserRole.ADMIN;
  const isMember = userRole === UserRole.MEMBER;
  const isAccess = isMember || isAdmin;

  const router = useRouter();
  const { pathname } = router;
  const normalizedPath = pathname.slice(1);
  const isDashboard = normalizedPath.includes('dashboard');
  const handleNavClick = (path: string) => {
    router.push(`/${path}`);
  };

  return (
    <Wrapper>
      <NavItems>
        <Menu
          style={{
            width: '100%',
            border: 'none',
            justifyContent: 'flex-start',
          }}
          mode="horizontal"
          defaultSelectedKeys={[isDashboard ? 'dashboard' : normalizedPath]}
          overflowedIndicator={<MenuOutlined />}
          onClick={(item) => {
            handleNavClick(item.key);
          }}
          items={[
            isAccess
              ? {
                  key: 'history',
                  icon: <HistoryOutlined />,
                  label: 'History',
                }
              : null,
            isAccess
              ? {
                  key: 'dashboard',
                  icon: <LineChartOutlined />,
                  label: 'Dashboard',
                }
              : null,
            session
              ? {
                  key: 'guide',
                  icon: <ReadOutlined />,
                  label: 'Guide',
                }
              : null,
            isAdmin
              ? {
                  key: 'admin',
                  icon: <UserOutlined />,
                  label: 'Admin',
                }
              : null,
          ]}
        />
      </NavItems>

      <NavItems>
        <Menu
          mode="horizontal"
          style={{
            width: '100%',
            border: 'none',
            justifyContent: 'flex-end',
          }}
          overflowedIndicator={<UserOutlined />}
          items={[
            { key: 'theme', icon: <ThemeSwitcher />, disabled: true },
            {
              key: 'login',
              icon: session ? (
                <HeaderLeftRight>
                  <UserInfo>
                    <Avatar
                      size="large"
                      style={{ marginLeft: 0 }}
                      icon={<UserOutlined />}
                      src={session.user?.image}
                    />
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {session.user?.name}
                    </Typography.Title>
                  </UserInfo>
                  <SignOutBtn />
                </HeaderLeftRight>
              ) : (
                <>
                  <SignInBtn />
                </>
              ),
              disabled: true,
              style: { display: 'flex', justifyContent: 'center' },
            },
          ]}
        />
      </NavItems>
    </Wrapper>
  );
};

const NavItems = styled.div`
  display: flex;
  align-items: center;
  flex: auto;
  min-width: 0;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 64px;
`;

const HeaderLeftRight = styled.div`
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-right: 30px;

  span {
    margin-left: 8px;
    font-size: 16px;
    color: black;
  }
`;

export default Header;
