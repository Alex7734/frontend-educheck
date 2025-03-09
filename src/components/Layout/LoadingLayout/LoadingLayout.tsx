import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingLayout: React.FC = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <FontAwesomeIcon
        icon={faSpinner}
        size='3x'
        className='text-white animate-spin'
      />
    </div>
  );
};

export default LoadingLayout;
