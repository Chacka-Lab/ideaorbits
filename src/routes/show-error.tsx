import { Title } from '@solidjs/meta';
import { useSearchParams } from '@solidjs/router';

export const SHOW_ERRORS = ['invalidToken', 'unexpectedError'] as const;
export type ShowError = (typeof SHOW_ERRORS)[number];

export default function showError() {
  const [params] = useSearchParams();

  return (
    <main>
      <Title>Error</Title>
      <h1>Show Error</h1>
      <p>{params['errCode']}</p>
    </main>
  );
}
