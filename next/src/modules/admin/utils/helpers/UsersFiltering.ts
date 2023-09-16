import { User } from '@/lib/orm/entity/User';
import { UserRole } from '@/types/common';

export const getFilteredUsers = (
  users: User[],
  queryName: string,
  sortByRole: UserRole[],
) => {
  let usersToView = users;
  const normalizedQuery = queryName.toLowerCase();

  if (normalizedQuery.trim()) {
    usersToView = users.filter(({ firstName, lastName }) => {
      const normalizedFirstName = firstName?.toLowerCase() || '';
      const normalizedLastName = lastName?.toLowerCase() || '';

      return (
        normalizedFirstName.includes(normalizedQuery) ||
        normalizedLastName.includes(normalizedQuery)
      );
    });
  }

  if (sortByRole.length > 0) {
    usersToView = usersToView.filter(({ role }) => sortByRole.includes(role));
  }

  return usersToView;
};
