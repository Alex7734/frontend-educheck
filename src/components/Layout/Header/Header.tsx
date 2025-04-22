'use client';
import { MxLink } from '@/components/MxLink';
import { logout } from '@/helpers';
import { RouteNamesEnum } from '@/localConstants';
import mvxLogo from '../../../../public/assets/img/logo.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getWindowLocation } from '@/utils/sdkDappUtils';
import { usePathname } from 'next/navigation';
import {
  faUserCircle,
  faDashboard,
  faList,
  faCertificate,
  faUsers,
  faDoorOpen
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from '@/wrappers/ModalProvider';
import { useTimerText } from '@/hooks/useTimerText';
import useGetIsLoggedInAnyWay from '@/hooks/auth/useGetIsLoggedInAnyWay';
import useAuthStore from '@/store/useAuthStore';
import useWeb2AuthService from '@/services/Queries/auth/useWeb2AuthService';
import { cn } from '@/helpers/style/cn';

export const Header = () => {
  const router = useRouter();
  const isLoggedIn = useGetIsLoggedInAnyWay();
  const isWeb2UserLoggedIn = useAuthStore().isAuthenticated();
  const { signOutMutation, isAdminValid } = useWeb2AuthService();
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

  const handleLogout = async () => {
    const { href } = getWindowLocation();
    sessionStorage.clear();

    if (isWeb2UserLoggedIn) {
      await signOutMutation.mutateAsync();
      onRedirect();
      return;
    }

    await logout(href, onRedirect, false);
  };

  const exitText = hideNav ? 'Forfeit' : 'Logout';

  const isDashboardRoute = Boolean(pathname === RouteNamesEnum.dashboard);
  const isCertificationsRoute = Boolean(
    pathname === RouteNamesEnum.certifications
  );
  const isCoursesRoute = Boolean(pathname === RouteNamesEnum.courses || pathname === RouteNamesEnum.coursesDashboard);
  const isUsersRoute = Boolean(pathname === RouteNamesEnum.usersDashboard);

  return (
    isLoggedIn && (
      <aside className='bg-[#0FB587] w-64 min-h-[1024px] p-5 flex rounded-r-2xl flex-col'>
        <div className='mb-10'>
          <Image src={mvxLogo} alt='logo' width={250} height={60} />
        </div>
        {isAdminValid && (
          <div className={' pl-4 flex items-center justify-center flex-col'}>
            <div className='flex mr-4 items-center justify-center mb-4 gap-2'>
              <FontAwesomeIcon
                icon={faUserCircle}
                size='sm'
                className='text-white'
              />
              <p className={'text-center text-green-100 t'}>Admin Mode</p>
            </div>
            <hr className='border border-white w-36' />
          </div>
        )}

        {hideNav ? (
          <div className='flex items-center text-[4rem] mt-48 justify-center mx-auto gap-2'>
            <h1 className='text-white font-bold'>
              Time: <br />
              {formatedText}
            </h1>
          </div>
        ) : (
          <nav>
            <ul className={'flex flex-col ml-12 gap-4 mt-8'}>
              <li className='mb-4'>
                <a
                  onClick={onDashboardRedirect}
                  className={cn(
                    'text-white text-sm flex items-center gap-4 hover:cursor-pointer',
                    isDashboardRoute && 'underline-offset-4 underline'
                  )}
                >
                  <FontAwesomeIcon
                    icon={faDashboard}
                    size='xl'
                    className='text-white'
                  />
                  <span className='title'>Dashboard</span>
                </a>
              </li>
              {!isAdminValid && (
                <li className='mb-4'>
                  <a
                    onClick={onCertificationsRedirect}
                    className={cn(
                      'text-white text-sm flex items-center gap-4 hover:cursor-pointer',
                      isCertificationsRoute && 'underline-offset-4 underline'
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faCertificate}
                      size='xl'
                      className='text-white'
                    />
                    <span className='title'>Certifications</span>
                  </a>
                </li>
              )}
              {isAdminValid && (
                <li className={'mb-4'}>
                  <a
                    onClick={() => router.push(RouteNamesEnum.usersDashboard)}
                    className={cn(
                      'text-white text-sm flex items-center gap-4 hover:cursor-pointer',
                      isUsersRoute && 'underline-offset-4 underline'
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      size='xl'
                      className='text-white'
                    />
                    <span className='title'>Users</span>
                  </a>
                </li>
              )}
              <li className='mb-4'>
                <a
                  onClick={isAdminValid ? () => router.push(RouteNamesEnum.coursesDashboard) : onCoursesRedirect}
                  className={cn(
                    'text-white text-sm flex items-center gap-4 hover:cursor-pointer',
                    isCoursesRoute && 'underline-offset-4 underline'
                  )}
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
