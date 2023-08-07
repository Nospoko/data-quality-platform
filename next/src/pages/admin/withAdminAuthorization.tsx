import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { UserRole } from '@/types/common';

const withAdminAuthorization = (
  WrappedComponent: React.ComponentType,
  getNestedLayout: (page: React.ReactElement) => React.ReactElement,
) => {
  return (props: any) => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const userRole = session?.user.role;
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') {
        return;
      }

      if (userRole !== UserRole.ADMIN) {
        router.push('/');
      } else {
        setLoading(false);
      }
    }, [userRole, status]);

    return loading ? null : getNestedLayout(<WrappedComponent {...props} />);
  };
};

export default withAdminAuthorization;
