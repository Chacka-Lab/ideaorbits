import { Title } from '@solidjs/meta';

import { useIntl } from '~/modules/intl/context';

export default function Home() {
  useIntl();
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <p>歌唱吧，青春留尾巴……</p>
    </main>
  );
}
