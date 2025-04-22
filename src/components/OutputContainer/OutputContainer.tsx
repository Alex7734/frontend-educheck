import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { WithClassnameType } from '@/types';

interface OutputContainerPropsType
  extends PropsWithChildren,
  WithClassnameType {
  isLoading?: boolean;
}

export const OutputContainer = (props: OutputContainerPropsType) => {
  const { children, className = 'p-4', isLoading = false } = props;

  return (
    <div
      className={classNames(
        'text-sm border border-gray-200 rounded overflow-auto',
        className
      )}
      data-testid={props['data-testid']}
      style={{
        opacity: isLoading ? 0.5 : 1
      }}
    >
      {children}
    </div>
  );
};
