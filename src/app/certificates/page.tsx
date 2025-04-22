import { SignMessage } from './widgets';
import { ClientHooks } from '@/components/ClientHooks';
import { Widget } from '@/components/Widget';
import { WidgetType } from '@/types/widget.types';
import TxList from '../../../public/assets/img/list.svg';
import Image from 'next/image';

const WIDGETS: WidgetType[] = [
  {
    title: 'Upload Certification',
    widget: SignMessage,
    description:
      'Upload certification about your skills to verify it on the chain',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account-1',
    anchor: 'sign-message',
  }
];

export default function Certifications() {
  return (
    <div className='mt-6'>
      <ClientHooks />
      <div className='flex flex-col max-w-4xl max-h-24 w-full'>
        {WIDGETS.map((element) => (
          <Widget key={element.title} {...element} />
        ))}
        <Image
          className={'w-[112%] h-fit'}
          src={TxList}
          alt={'List of transactions'}
        />
      </div>
    </div>
  );
}
