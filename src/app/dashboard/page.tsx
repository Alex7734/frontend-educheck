'use client';
import { Account, PingPongRaw } from './widgets';
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import { Widget } from '@/components/Widget';
import { WidgetType } from '@/types/widget.types';
import useWeb2AuthService from '@/services/Queries/auth/useWeb2AuthService';

export default function Dashboard() {
  const { isAdminValidQuery } = useWeb2AuthService();

  const WIDGETS: WidgetType[] = [
    {
      title: 'Account',
      widget: Account,
      description: 'Connected account details',
      reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
    },
    ...(!isAdminValidQuery
      ? [
          {
            title: 'Verify CV',
            widget: PingPongRaw,
            description: 'Smart Contract used to verify and sign your CV',
            reference: 'https://github.com/multiversx/mx-ping-pong-service',
            anchor: 'ping-pong-backend'
          }
        ]
      : [])
  ];

  return (
    <div className='mt-6'>
      <ClientHooks />
      <AuthRedirectWrapper>
        <div className='flex flex-col gap-6 max-w-4xl max-h-32 min-w-[960px]'>
          {WIDGETS.map((element) => (
            <Widget key={element.title} {...element} />
          ))}
        </div>
      </AuthRedirectWrapper>
    </div>
  );
}
