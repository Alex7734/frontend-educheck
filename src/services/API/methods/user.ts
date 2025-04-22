import API from '..';
import { TUser, TCreateUser, TUpdateUser } from '@/schemas/user';

export const createUser = async (userData: TCreateUser): Promise<TUser> => {
  try {
    const response = await API.post('/user', userData);
    return response.data;
  } catch (error) {
    console.error('createUser error:', error);
    throw error;
  }
};

export const getUsers = async (type?: 'users' | 'admins'): Promise<TUser[]> => {
  try {
    const url = type ? `/user?type=${type}` : '/user/users';
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error('getUsers error:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<TUser> => {
  try {
    const response = await API.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('getUserById error:', error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<TUpdateUser>
): Promise<TUser> => {
  try {
    const response = await API.patch(`/user/${id}`, userData);
    return response.data
  } catch (error) {
    console.error('updateUser error:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await API.delete(`/user/${id}`);
  } catch (error) {
    console.error('deleteUser error:', error);
    throw error;
  }
};
