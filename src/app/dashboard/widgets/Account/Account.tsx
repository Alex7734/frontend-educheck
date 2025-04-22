'use client';
import { FormatAmount, OutputContainer, Label } from '@/components';
import useGeUser from '@/hooks/auth/useGeUser';
import useWeb2AuthService from '@/services/Queries/auth/useWeb2AuthService';

export const Account = () => {
  const crossUser = useGeUser();
  const { isAdminValid } = useWeb2AuthService();

  if (!crossUser) {
    return (
      <OutputContainer>
        <div className='flex flex-col text-black' data-testid='topInfo'>
          <p className={'text-center'}>No account connected</p>
        </div>
      </OutputContainer>
    );
  }

  const { userWeb2, userWeb3, type } = crossUser;

  const renderUserType = () => (
    <p>
      <Label>Account Type: </Label>
      <span data-testid='accountType'>
        {type === 'web2' ? 'Web2' : 'Web3'}
        {isAdminValid && <b> Admin</b>}
      </span>
    </p>
  );

  if (type === 'web2' && userWeb2) {
    const hasAge = userWeb2.age != null && userWeb2.age > 0;

    return (
      <OutputContainer>
        <div className='flex flex-col text-black' data-testid='topInfo'>
          <p className='truncate'>
            <Label>Name: </Label>
            <span data-testid='accountUsername'>{userWeb2.name}</span>
          </p>
          <p>
            <Label>Email: </Label>
            <span data-testid='accountEmail'>{userWeb2.email}</span>
          </p>
          {hasAge && !isAdminValid && (
            <p className='truncate'>
              <Label>Age: </Label>
              <span data-testid='accountAge'>{userWeb2.age}</span>
            </p>
          )}
          {renderUserType()}
        </div>
      </OutputContainer>
    );
  }

  return (
    <OutputContainer>
      <div className='flex flex-col text-black' data-testid='topInfo'>
        <p className='truncate'>
          <Label>Address: </Label>
          <span data-testid='accountAddress'> {userWeb3?.address}</span>
        </p>

        <p>
          <Label>Shard: </Label>
          {userWeb3?.shard ? (
            <span data-testid='accountShard'>{userWeb3.shard}</span>
          ) : (
            <span data-testid='accountShard'>-</span>
          )}
        </p>

        <p>
          <Label>Balance: </Label>
          <FormatAmount
            value={userWeb3?.balance || '0'}
            egldLabel={userWeb3?.network.egldLabel || 'EGLD'}
            data-testid='balance'
          />
        </p>
        {renderUserType()}
      </div>
    </OutputContainer>
  );
};
