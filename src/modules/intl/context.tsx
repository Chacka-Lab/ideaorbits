import { createContext, type ParentComponent, splitProps, useContext } from 'solid-js';

import { intlConfig, type Locale, type Timezone } from './config';
import type { Messages } from './core';

interface IntlContextValue {
  readonly locale: Locale;
  readonly timezone: Timezone;
  readonly messages: Messages;
}

const IntlContext = createContext<IntlContextValue>({
  locale: intlConfig.defaultLocale,
  timezone: intlConfig.defaultTimezone,
  messages: {},
});

export const IntlProvider: ParentComponent<IntlContextValue> = (props) => {
  const [, value] = splitProps(props, ['children']);
  return <IntlContext.Provider value={value}>{props.children}</IntlContext.Provider>;
};

export const useIntl = () => useContext(IntlContext);
