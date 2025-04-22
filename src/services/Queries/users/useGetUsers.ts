import { useQuery } from '@tanstack/react-query';
import { getUsers, getUserById } from '@/api/user';
import { TUser } from '@/schemas/user';

export const useGetUsers = () => {
  const getUsersQuery = useQuery<TUser[], Error>({
    queryKey: ['users'],
    queryFn: () => getUsers('users')
  });

  const useUserById = (id: string) =>
    useQuery<TUser, Error>({
      queryKey: ['user', id],
      queryFn: () => getUserById(id),
      enabled: !!id
    });

  return {
    getUsersQuery,
    useUserById
  };
};
