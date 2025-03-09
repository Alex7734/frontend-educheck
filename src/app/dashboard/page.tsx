import { Account, PingPongRaw } from './widgets';
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import { Widget } from '@/components/Widget';
import { WidgetType } from '@/types/widget.types';

const WIDGETS: WidgetType[] = [
  {
    title: 'Account',
    widget: Account,
    description: 'Connected account details',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Verify CV',
    widget: PingPongRaw,
    description: 'Smart Contract used to verify and sign your CV',
    reference: 'https://github.com/multiversx/mx-ping-pong-service',
    anchor: 'ping-pong-backend'
  }
];

export default function Dashboard() {
  return (
    <div className='mt-6'>
      <ClientHooks />
      <AuthRedirectWrapper>
        <div className='flex flex-col gap-6 max-w-4xl max-h-32 w-full'>
          {WIDGETS.map((element) => (
            <Widget key={element.title} {...element} />
          ))}
        </div>
      </AuthRedirectWrapper>
    </div>
  );
}
