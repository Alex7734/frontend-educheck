import { Button } from '@/components';
import type { MouseEvent, ReactNode } from 'react';

export class ButtonFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private props: Record<string, any> = {};
  private onClick: (e: MouseEvent) => void;

  constructor(onClick: (e: MouseEvent) => void) {
    if (!onClick) {
      throw new Error('onClick is required for ButtonFactory.');
    }

    this.onClick = onClick;

    this.props = {
      className:
        'inline-block rounded-lg px-6 py-2 text-center hover:no-underline my-0 bg-[#0FB587] text-white hover:bg-[#1FB599] mr-0 disabled:bg-gray-200 disabled:text-black text-sm disabled:cursor-not-allowed',
      type: 'button',
      disabled: false
    };
  }

  withText(children: ReactNode): this {
    this.props.children = children;
    return this;
  }

  withDisabled(disabled: boolean): this {
    this.props.disabled = disabled;
    return this;
  }

  withType(type: 'button' | 'submit' | 'reset'): this {
    this.props.type = type;
    return this;
  }

  withClassName(className: string): this {
    this.props.className = className;
    return this;
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withTestId(testId: string): this {
    this.props['data-testid'] = testId;
    return this;
  }

  build() {
    return <Button onClick={this.onClick} {...this.props} />;
  }
}
