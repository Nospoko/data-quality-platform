import { UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Space } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { styled } from 'styled-components';

import SignInBtn from './buttons/SignInBtn';
import SignOutBtn from './buttons/SignOutBtn';

const Header = () => {
  const { data: session } = useSession();
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
      <Menu
        style={{ width: '100%' }}
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[normalizedPath]}
        onClick={(item) => {
          handleNavClick(item.key);
        }}
        items={[
          {
            key: 'home',
            label: 'Home',
          },
          {
            key: 'history',
            label: 'History/Review',
          },
        ]}
      />
      <SignWrapper>
        {session ? (
          <Space size={32}>
            <UserInfo>
              <Avatar
                size="large"
                icon={<UserOutlined />}
                src={session.user?.image}
              />
              <span>{session.user?.name}</span>
            </UserInfo>
            <SignOutBtn />
          </Space>
        ) : (
          <SignInBtn />
        )}
      </SignWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 64px;
`;

const SignWrapper = styled.div`
  padding-right: 12px;
  width: 500px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
    font-size: 16px;
    color: black;
  }
`;

export default Header;
