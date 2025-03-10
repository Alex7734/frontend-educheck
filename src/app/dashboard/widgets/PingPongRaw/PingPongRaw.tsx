'use client';
import { useEffect, useState } from 'react';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Button } from '@/components/Button';
import { ContractAddress } from '@/components/ContractAddress';
import { Label } from '@/components/Label';
import { OutputContainer, PingPongOutput } from '@/components/OutputContainer';
import { getCountdownSeconds, setTimeRemaining } from '@/helpers';
import { useGetPendingTransactions, useSendPingPongTransaction } from '@/hooks';
import { SessionEnum } from '@/localConstants';
import { SignedTransactionType, WidgetProps, CypressEnums } from '@/types';
import { useGetTimeToPong, useGetPingAmount } from './hooks';
import FileDrop from '@/components/FileDrop/FileDrop';
import { useModal } from '@/wrappers/ModalProvider';

// Raw transaction are being done by directly requesting to API instead of calling the smartcontract
export const PingPongRaw = ({ callbackRoute }: WidgetProps) => {
  const { hideModal, showModal } = useModal();
  const getTimeToPong = useGetTimeToPong();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { sendPingTransaction, sendPongTransaction, transactionStatus } =
    useSendPingPongTransaction({
      type: SessionEnum.rawPingPongSessionId
    });
  const pingAmount = useGetPingAmount();

  const [stateTransactions, setStateTransactions] = useState<
    SignedTransactionType[] | null
  >(null);
  const [hasPing, setHasPing] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const setSecondsRemaining = async () => {
    const secondsRemaining = await getTimeToPong();
    const { canPing, timeRemaining } = setTimeRemaining(secondsRemaining);

    setHasPing(canPing);
    if (timeRemaining && timeRemaining >= 0) {
      setSecondsLeft(timeRemaining);
    }
  };

  const onSendPingTransaction = async () => {
    const fileUploader = (
      <FileDrop
        onFileSubmit={async () => {
          sendPingTransaction({ amount: pingAmount, callbackRoute });
          hideModal();
        }}
      />
    );
    showModal(fileUploader, 'Upload CV');
  };
  const onSendPongTransaction = async () => {
    await sendPongTransaction({ callbackRoute });
  };

  const timeRemaining = moment()
    .startOf('day')
    .seconds(secondsLeft ?? 0)
    .format('mm:ss');

  const pongAllowed = secondsLeft === 0;

  useEffect(() => {
    getCountdownSeconds({ secondsLeft, setSecondsLeft });
  }, [hasPing]);

  useEffect(() => {
    if (transactionStatus.transactions) {
      setStateTransactions(transactionStatus.transactions);
    }
  }, [transactionStatus]);

  useEffect(() => {
    setSecondsRemaining();
  }, [hasPendingTransactions]);

  const isPingDisabled = !hasPing || hasPendingTransactions;
  const isPongDisabled = !pongAllowed || hasPing || hasPendingTransactions;

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-start gap-2'>
          <Button
            disabled={isPingDisabled}
            onClick={onSendPingTransaction}
            data-testid='btnPingRaw'
            data-cy={CypressEnums.transactionBtn}
          >
            <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
            Upload
          </Button>

          <Button
            disabled={isPongDisabled}
            data-testid='btnPongRaw'
            data-cy={CypressEnums.transactionBtn}
            onClick={onSendPongTransaction}
          >
            <FontAwesomeIcon icon={faArrowDown} className='mr-1' />
            Receive
          </Button>
        </div>
      </div>

      <OutputContainer>
        {!stateTransactions && (
          <>
            <ContractAddress />
            {!pongAllowed && (
              <p>
                <Label>Time remaining: </Label>
                <span className='text-red-600'>{timeRemaining}</span> until able
                to pong
              </p>
            )}
          </>
        )}
        <PingPongOutput
          transactions={stateTransactions}
          pongAllowed={pongAllowed}
          timeRemaining={timeRemaining}
        />
      </OutputContainer>
    </div>
  );
};
