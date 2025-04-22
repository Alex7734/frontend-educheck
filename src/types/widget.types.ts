export type WidgetProps = {
  callbackRoute: string;
};

export type WidgetType<T = WidgetProps> = {
  title: string;
  widget: (props: T) => JSX.Element;
  description?: string;
  props?: { receiver?: string };
  reference: string;
  anchor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
};
