import { CopyButton, Label } from '@/components';
import { useGetAccountInfo, useGetLastSignedMessageSession } from '@/hooks';
import { decodeMessage } from '../helpers';

export const SignSuccess = ({ messageToSign }: { messageToSign: string }) => {
  const { address } = useGetAccountInfo();
  const signedMessageInfo = useGetLastSignedMessageSession();

  if (!signedMessageInfo?.signature) {
    return null;
  }

  const { signature } = signedMessageInfo;

  const { encodedMessage } = decodeMessage({
    address,
    message: messageToSign,
    signature
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col w-[calc(100%-50px)]'>
        <div className='flex flex-row w-full gap-2'>
          <Label>Signature:</Label>

          <textarea
            readOnly
            className='w-full resize-none outline-none bg-transparent'
            rows={2}
            defaultValue={signature}
          />
          <CopyButton text={signature} />
        </div>

        <div className='flex flex-col w-full gap-2 mt-6'>

          <div className='flex flex-col w-full gap-2 mt-6'>
            <Label>Encoded message:</Label>
            <textarea className={'resize-y h-16 outline-none bg-transparent'} rows={2} value={encodedMessage} readOnly />
          </div>

        </div>
      </div>
    </div>
  );
};
