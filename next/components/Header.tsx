import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { useSession } from 'next-auth/react';
import { styled } from 'styled-components';

import SignInBtn from './buttons/SignInBtn';
import SignOutBtn from './buttons/SignOutBtn';

const Header = () => {
  const { data: session } = useSession();

  return (
    <div>
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
    </div>
  );
};

const UserInfo = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
  }
`;

export default Header;
