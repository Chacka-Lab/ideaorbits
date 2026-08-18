import { Title } from '@solidjs/meta';
import { createAsync } from '@solidjs/router';

import { verifyCookieToken } from '~/functions/user/auth/session';

export default function Home() {
  const session = createAsync(() => verifyCookieToken()).latest;

  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <p>{session?.success ? session.data.user.username : 'none'}</p>
    </main>
  );
}
