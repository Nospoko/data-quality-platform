import { HistoryOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { styled } from 'styled-components';

import SignInBtn from './buttons/SignInBtn';
import SignOutBtn from './buttons/SignOutBtn';
import ThemeSwitcher from './buttons/ThemeSwitcher';

import { UserRole } from '@/types/common';

const Header = () => {
  const { data: session } = useSession();

  const isAdmin = session?.user.role === UserRole.ADMIN;

  const router = useRouter();
  const { pathname } = router;
  const normalizedPath = pathname === '/' ? 'home' : pathname.slice(1);
  const handleNavClick = (path: string) => {
    if (path === 'home') {
      router.push('/');

      return;
    }

    router.push(`/${path}`);
  };

  return (
    <Wrapper>
      <NavItems>
        <Menu
          style={{
            width: '100%',
            border: 'none',
          }}
          mode="horizontal"
          defaultSelectedKeys={[normalizedPath]}
          onClick={(item) => {
            handleNavClick(item.key);
          }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="history" icon={<HistoryOutlined />}>
            History
          </Menu.Item>
          <Menu.Item key="theme" disabled>
            <ThemeSwitcher />
          </Menu.Item>
          {isAdmin && (
            <Menu.SubMenu
              title="Admin"
              key="admin"
              onTitleClick={() => handleNavClick('admin')}
            >
              <Menu.Item key="admin/organizations">Organizations</Menu.Item>
              <Menu.Item key="admin/users">Users</Menu.Item>
            </Menu.SubMenu>
          )}
          <Menu.Item key="login" disabled>
            {session ? (
              <HeaderLeftRight>
                <UserInfo>
                  <Avatar
                    size="large"
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
            )}
          </Menu.Item>
        </Menu>
      </NavItems>
    </Wrapper>
  );
};

const NavItems = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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
