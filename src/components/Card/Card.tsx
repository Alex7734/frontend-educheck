import type { PropsWithChildren } from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WithClassnameType } from '@/types';
import { Icon } from '@fortawesome/fontawesome-svg-core';

interface CardType extends PropsWithChildren, WithClassnameType {
  title: string;
  icon?: Icon;
  description?: string;
  reference: string;
  anchor?: string;
}

export const Card = (props: CardType) => {
  const { title, children, description, reference, anchor, icon } = props;
  return (
    <div
      className='flex flex-col flex-1 rounded-xl bg-white p-6 mx-4 gap-3 justify-center'
      data-testid={props['data-testid']}
      id={anchor}
    >
      <div className={'flex flex-row'}>
        {icon &&
          <div className={'flex flex-col items-center justify-center'}>
            <FontAwesomeIcon icon={icon} size="sm" className="text-white" />
          </div>
        }
        <div className={'flex flex-col'}>
          <h2 className='flex text-xl font-bold tracking-wide group'>
            {title}
            <a
              href={reference}
              target='_blank'
              className='hidden group-hover:block ml-2 text-blue-600'
            >
              <FontAwesomeIcon icon={faInfoCircle} size='sm' />
            </a>
          </h2>
          {description && <p className='text-gray-400 text-sm mb-6'>{description}</p>}
        </div>
      </div>

      {children}

    </div>
  );
};
