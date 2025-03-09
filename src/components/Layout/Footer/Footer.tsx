import heartIcon from '../../../../public/assets/img/heart.svg';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className='mx-auto w-full max-w-prose pb-6 pl-6 pr-6 text-center text-gray-400'>
      <div className='flex flex-col items-center text sm text-gray-400'>
        <p className={'flex flex-row items-center'}>
          Made with <Image src={heartIcon} alt='love' className='mx-1' /> by the
         HocPoc team using Next.js & SDK-Dapp-Boilerplate
        </p>
      </div>
    </footer>
  );
};
