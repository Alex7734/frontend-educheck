import React from 'react';
import { useUserCRUD } from '@/services/Queries/admin/useUserCRUD';
import { Loader } from '@/components';
import { EnrollmentManager } from '@/components/EnrollmentManager/EnrollmentManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '@/wrappers/ModalProvider';

interface UserDetailsProps {
  userId: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId }) => {
  const { data: user, isLoading, error } = useUserCRUD().useUserById(userId);
  const { showModal } = useModal();

  if (isLoading) return <Loader />;
  if (error || !user) return <div>Error loading user details.</div>;

  const handleManageEnrollments = () => {
    showModal(
      <EnrollmentManager userId={userId} mode="user" />,
      'Manage Course Enrollments'
    );
  };

  return (
    <div className='p-4 max-w-[500px]'>
      <div className='space-y-4'>
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
      <div className='mt-6'>
        <button
          onClick={handleManageEnrollments}
          className='bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600 transition-colors'
        >
          <FontAwesomeIcon icon={faGraduationCap} />
          Manage Course Enrollments
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
