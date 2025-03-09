import React from 'react';
import { useUserCRUD } from '@/services/Queries/admin/useUserCRUD';
import { Loader } from '@/components';

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

export default UserDetails;
