import './app.css';

import { MetaProvider, Title } from '@solidjs/meta';
import { createAsync, Router, type RouteSectionProps } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';

import { intlConfig } from '~/modules/intl/config';
import { IntlProvider } from '~/modules/intl/context';
import { getRequestIntl } from '~/modules/intl/request';

function RootLayout(props: RouteSectionProps) {
  const reqIntl = createAsync(() => getRequestIntl(), { deferStream: true });

  return (
    <MetaProvider>
      <Title>IdeaOrbits</Title>
      <IntlProvider
        locale={reqIntl()?.locale ?? intlConfig.defaultLocale}
        timezone={reqIntl()?.timezone ?? intlConfig.defaultTimezone}
        messages={reqIntl()?.messages ?? {}}
      >
        <Suspense>{props.children}</Suspense>
      </IntlProvider>
    </MetaProvider>
  );
}

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  );
}
