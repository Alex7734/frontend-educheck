'use client';
import { MxLink } from '@/components/MxLink';
import { logout } from '@/helpers';
import { useGetIsLoggedIn } from '@/hooks';
import { RouteNamesEnum } from '@/localConstants';
import mvxLogo from '../../../../public/assets/img/logo.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getWindowLocation } from '@/utils/sdkDappUtils';
import { usePathname } from 'next/navigation';
import {
  faUserCircle,
  faDashboard,
  faRoad,
  faList,
  faCertificate,
  faDoorOpen
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from '@/wrappers/BatchTransactionsContextProvider/AssesmentProvider';
import { useTimerText } from '@/hooks/useTimerText';
import useGetIsLoggedInAnyWay from '@/hooks/auth/useGetIsLoggedInAnyWay';

export const Header = () => {
  const router = useRouter();
  const isLoggedIn = useGetIsLoggedInAnyWay();
  const pathname = usePathname();
  const { hideNav } = useModal();
  const formatedText = useTimerText();

  const isUnlockRoute = Boolean(pathname === RouteNamesEnum.unlock);

  const ConnectButton = isUnlockRoute ? null : (
    <MxLink to={RouteNamesEnum.unlock}>Connect</MxLink>
  );

  const onRedirect = () => router.replace(RouteNamesEnum.unlock);

  const onDashboardRedirect = () => router.replace(RouteNamesEnum.dashboard);

  const onCertificationsRedirect = () =>
    router.replace(RouteNamesEnum.certifications);

  const onCoursesRedirect = () => router.replace(RouteNamesEnum.courses);

  const handleLogout = () => {
    const { href } = getWindowLocation();
    sessionStorage.clear();
    logout(href, onRedirect, false);
  };

  const exitText = hideNav ? 'Forfeit' : 'Logout';

  return (
    isLoggedIn && (
      <aside className='bg-[#0FB587] w-64 min-h-[1024px] p-5 flex rounded-r-2xl flex-col'>
        <div className='mb-10'>
          <Image src={mvxLogo} alt='logo' width={250} height={60} />
        </div>
        <div className='flex items-center justify-center mb-4 gap-2'>
          <FontAwesomeIcon
            icon={faUserCircle}
            size='sm'
            className='text-white'
          />
          <p className={'text-center text-green-100 t'}>erd1u...8zxy79</p>
        </div>

        {hideNav ? (
          <div className='flex items-center text-[4rem] mt-48 justify-center mx-auto gap-2'>
            <h1 className='text-white font-bold'>
              Time: <br />
              {formatedText}
            </h1>
          </div>
        ) : (
          <nav>
            <ul className={'flex flex-col ml-12 gap-4 mt-12'}>
              <li className='mb-4'>
                <a
                  onClick={onDashboardRedirect}
                  className='text-white text-sm flex items-center gap-2 hover:cursor-pointer'
                >
                  <FontAwesomeIcon
                    icon={faDashboard}
                    size='xl'
                    className='text-white'
                  />
                  <span className='title'>Dashboard</span>
                </a>
              </li>
              <li className='mb-4'>
                <a
                  onClick={onCertificationsRedirect}
                  className='text-white text-sm flex items-center gap-2 hover:cursor-pointer'
                >
                  <FontAwesomeIcon
                    icon={faCertificate}
                    size='xl'
                    className='text-white'
                  />
                  <span className='title'>Certifications</span>
                </a>
              </li>
              <li className='mb-4'>
                <a
                  onClick={onCoursesRedirect}
                  className='text-white text-sm flex items-center gap-2 hover:cursor-pointer'
                >
                  <FontAwesomeIcon
                    icon={faList}
                    size='xl'
                    className='text-white'
                  />
                  <span className='title'>Courses</span>
                </a>
              </li>
              <hr className='border border-white w-36' />
              <li className='mt-4'>
                {isLoggedIn ? (
                  <a
                    onClick={handleLogout}
                    className='text-white text-sm flex items-center gap-2 hover:cursor-pointer'
                  >
                    <FontAwesomeIcon
                      icon={faDoorOpen}
                      size='xl'
                      className='text-white'
                    />
                    <span className='title'>{exitText}</span>
                  </a>
                ) : (
                  ConnectButton
                )}
              </li>
            </ul>
          </nav>
        )}
      </aside>
    )
  );
};
