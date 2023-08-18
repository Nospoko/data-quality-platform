import { getServerSession } from 'next-auth';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { UserRole } from '@/types/common';

export const authenticateUser = async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  if (session.user.role !== UserRole.ADMIN) {
    return res.status(403).json({
      error: 'Access forbidden. You are not authorized to perform this action.',
    });
  }

  return next();
};
