'use client';

import React from 'react';
import { TCreateUser, TUser } from '@/schemas/user';
import { useModal } from '@/wrappers/ModalProvider';
import { useUserCRUD } from '@/services/Queries/admin/useUserCRUD';
import { Loader } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import UserDetails from './modals/UserDetails';
import UserForm from './modals/UserForm';
import { truncate } from '@/helpers/string';

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

  const openViewUserModal = (userId: string) => {
    showModal(<UserDetails userId={userId} />, 'User Details');
  };

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
      {getUsersQuery.data?.length ? (
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
      ) : (
        <div className='flex flex-col justify-center items-center h-[50vh] text-gray-500'>
          <p>No users found.</p>
          <p>Click &quot;Create User&quot; to add a new user.</p>
        </div>
      )}
    </div>
  );
}
