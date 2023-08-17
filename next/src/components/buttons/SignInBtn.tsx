import { Button } from 'antd';
import { signIn } from 'next-auth/react';

const SignInBtn = () => {
  const handleSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signIn();
  };

  return (
    <a href="#" onClick={handleSignIn}>
      <Button type="primary">Sign In</Button>
    </a>
  );
};

export default SignInBtn;
