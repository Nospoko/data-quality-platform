import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { UserRole } from '@/types/common';

const withAdminAuthorization = (
  WrappedComponent: React.ComponentType,
  getNestedLayout: (page: React.ReactElement) => React.ReactElement,
) => {
  return (props: any) => {
    const { data: session } = useSession();
    const userRole = session?.user.role;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (userRole !== UserRole.ADMIN) {
        router.push('/');
      } else {
        setLoading(false);
      }
    }, [session?.user.role]);

    return loading ? null : getNestedLayout(<WrappedComponent {...props} />);
  };
};

export default withAdminAuthorization;
