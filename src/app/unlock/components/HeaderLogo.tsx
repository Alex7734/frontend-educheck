import Image from 'next/image';
import mvxLogo from '../../../../public/assets/img/multiversx-logo.svg';
import React from 'react';

function HeaderLogo() {
  return (
    <div className='mb-10'>
      <Image src={mvxLogo} alt='logo' width={250} height={60} />
    </div>
  );
}

export default HeaderLogo;
