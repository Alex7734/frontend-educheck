'use client';

import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import {
  createUserSchema,
  updateUserSchema,
  TCreateUser,
  TUpdateUser,
  TUser
} from '@/schemas/user';
import { useModal } from '@/wrappers/BatchTransactionsContextProvider/AssesmentProvider';
import { useUserCRUD } from '@/services/Queries/admin/useUserCRUD';
import { Loader } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface UserFormProps {
  initialValues?: Partial<TCreateUser | TUpdateUser>;
  onSubmitMutation: (data: TCreateUser | TUpdateUser) => Promise<void>;
  title: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmitMutation,
  title
}) => {
  const resolver = zodResolver(
    initialValues ? updateUserSchema : createUserSchema
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<TCreateUser | TUpdateUser>({
    resolver,
    defaultValues: initialValues || {}
  });

  const onSubmit = async (data: TCreateUser | TUpdateUser) => {
    try {
      await onSubmitMutation(data);
    } catch (error: unknown) {
      const isAxiosErrorWithValidMessage =
        error instanceof AxiosError &&
        error?.message &&
        error?.response?.status !== 401;
      if (isAxiosErrorWithValidMessage) {
        setError('root', {
          type: 'server',
          message: error.response?.data?.message || error.message
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Operation failed. Please try again.'
        });
      }
    }
  };

  return (
    <motion.div
      className='p-4 min-w-[360px]'
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <h2 className='text-xl font-bold mb-4'>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <input
          {...register('name')}
          placeholder='Name'
          className='border  p-2'
        />
        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        <input
          {...register('email')}
          placeholder='Email'
          className='border p-2'
        />
        {(errors as FieldErrors<TCreateUser>).email && (
          <p className='text-red-500'>
            {(errors as FieldErrors<TCreateUser>).email?.message}
          </p>
        )}
        {/* Only show password field when creating a new user */}
        {!initialValues && (
          <>
            <input
              {...register('password')}
              type='password'
              placeholder='Password'
              className='border  p-2'
            />
            {(errors as FieldErrors<TCreateUser>).password && (
              <p className='text-red-500'>
                {(errors as FieldErrors<TCreateUser>).password?.message}
              </p>
            )}
          </>
        )}
        <input
          {...register('age', { valueAsNumber: true })}
          type='number'
          placeholder='Age'
          className='border p-2'
        />
        {errors.age && <p className='text-red-500'>{errors.age.message}</p>}
        <button
          type='submit'
          className='bg-green-500 text-white px-4 py-2 rounded'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : title}
        </button>
        {errors.root && (
          <p className='text-red-500 mt-2'>{errors.root.message}</p>
        )}
      </form>
    </motion.div>
  );
};

interface UserDetailsProps {
  userId: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId }) => {
  const { data: user, isLoading, error } = useUserCRUD().useUserById(userId);
  if (isLoading) return <Loader />;
  if (error || !user) return <div>Error loading user details.</div>;

  return (
    <div className='p-4'>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Age:</strong> {user.age}
      </p>
    </div>
  );
};

const truncate = (text: string, maxLength = 50) =>
  text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

export default function UsersDashboard() {
  const {
    createUserMutation,
    getUsersQuery,
    useUserById,
    updateUserMutation,
    deleteUserMutation
  } = useUserCRUD();
  const { showModal, hideModal } = useModal();

  if (getUsersQuery.isLoading) {
    return (
      <div className='flex justify-center items-center h-[100vh]'>
        <Loader />
      </div>
    );
  }

  if (getUsersQuery.error) {
    return (
      <div className='flex flex-col justify-center items-center h-[100vh]'>
        <p className='text-red-500'>Error loading users. Please try again.</p>
        <a
          className='text-blue-500 underline cursor-pointer'
          onClick={() => getUsersQuery.refetch()}
        >
          Refresh
        </a>
      </div>
    );
  }

  const openCreateUserModal = () => {
    setTimeout(
      () =>
        showModal(
          <UserForm
            title='Create User'
            onSubmitMutation={async (data) => {
              await createUserMutation.mutateAsync(data as TCreateUser);
              hideModal();
            }}
          />,
          ''
        ),
      300
    );
  };

  // Opens a modal to view user details (read-only)
  const openViewUserModal = (userId: string) => {
    showModal(<UserDetails userId={userId} />, 'User Details');
  };

  // Opens a modal to edit a user.
  const openEditUserModal = (userId: string) => {
    const EditUserForm = () => {
      const { data: user, isLoading, error } = useUserById(userId);
      if (isLoading) return <Loader />;
      if (error || !user) return <div>Error loading user details.</div>;

      return (
        <UserForm
          initialValues={user}
          title='Update User'
          onSubmitMutation={async (data) => {
            await updateUserMutation.mutateAsync({ id: userId, data });
            hideModal();
          }}
        />
      );
    };
    showModal(<EditUserForm />, '');
  };

  return (
    <div className='p-4'>
      <button
        onClick={openCreateUserModal}
        className='bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2'
      >
        <FontAwesomeIcon icon={faEdit} className='text-white' />
        <span>Create User</span>
      </button>
      <table className='min-w-full border-collapse border border-black bg-green-50'>
        <thead>
          <tr>
            <th className='border border-black px-4 py-2'>Name</th>
            <th className='border border-black px-4 py-2'>Email</th>
            <th className='border border-black px-4 py-2'>Age</th>
            <th className='border border-black px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getUsersQuery.data?.map((user: TUser) => (
            <tr key={user.id} className='hover:bg-green-100'>
              <td
                className='border border-black px-4 py-2 gap-2 cursor-pointer'
                onClick={() => openViewUserModal(user.id)}
              >
                <div className='flex items-center gap-2 group'>
                  <FontAwesomeIcon
                    icon={faEye}
                    size='sm'
                    className='group-hover:text-green-500'
                  />
                  {truncate(user.name)}
                </div>
              </td>
              <td className='border border-black px-4 py-2'>
                {truncate(user.email)}
              </td>
              <td className='border border-black px-4 py-2'>{user.age}</td>
              <td className='border border-black px-4 py-2'>
                <div className='flex items-center justify-around'>
                  <button
                    onClick={() => openEditUserModal(user.id)}
                    className='hover:text-yellow-500'
                    title='Edit'
                  >
                    <FontAwesomeIcon icon={faEdit} size='lg' />
                  </button>
                  <button
                    onClick={async () => {
                      await deleteUserMutation.mutateAsync(user.id);
                    }}
                    className='hover:text-red-500'
                    title='Delete'
                  >
                    <FontAwesomeIcon icon={faTrashAlt} size='lg' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
