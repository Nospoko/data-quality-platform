import { Button } from 'antd';
import { signOut } from 'next-auth/react';

const SignOutBtn = () => {
  const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signOut();
  };

  return (
    <a href="#" onClick={handleSignOut}>
      <Button type="primary">Sign Out</Button>
    </a>
  );
};

export default SignOutBtn;
