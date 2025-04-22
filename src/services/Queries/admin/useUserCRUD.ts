import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, deleteUser } from '@/api/user';
import { TUser, TCreateUser, TUpdateUser } from '@/schemas/user';
import { useGetUsers } from '../users/useGetUsers';

export const useUserCRUD = () => {
  const queryClient = useQueryClient();
  const { getUsersQuery, useUserById } = useGetUsers();

  const createUserMutation = useMutation<TUser, Error, TCreateUser>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      console.error('createUserMutation error:', error);
      toast.error('Error creating user');
    }
  });

  const updateUserMutation = useMutation<
    TUser,
    Error,
    { id: string; data: Partial<TUpdateUser> }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error) => {
      console.error('updateUserMutation error:', error);
      toast.error('Error updating user');
    }
  });

  const deleteUserMutation = useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['user', id] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      console.error('deleteUserMutation error:', error);
      toast.error('Error deleting user');
    }
  });

  return {
    createUserMutation,
    getUsersQuery,
    useUserById,
    updateUserMutation,
    deleteUserMutation
  };
};
