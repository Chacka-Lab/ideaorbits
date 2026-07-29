// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';
import { getRequestEvent } from 'solid-js/web';

import { normalizeLocale } from '~/modules/intl/config';
import { getRequestIntl } from '~/modules/intl/request';

export default createHandler(
  () => {
    const lang = normalizeLocale(getRequestEvent()?.locals.locale);

    return (
      <StartServer
        document={({ assets, children, scripts }) => (
          <html lang={lang}>
            <head>
              <meta charset="utf-8" />
              <meta name="description" content="Express ideas without frustration." />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
              <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
              {assets}
            </head>
            <body>
              <div id="app">{children}</div>
              {scripts}
            </body>
          </html>
        )}
      />
    );
  },
  async (event) => {
    event.locals.locale = (await getRequestIntl()).locale;
    return {};
  },
);
