import db from '~/lib/db';
import { emailSchema } from '~/modules/user/schemas/basic';

type UserId = string;

export async function findUserByEmail(email: string): Promise<UserId | null> {
  const parsed = emailSchema.safeParse({ email });
  if (!parsed.success) return null;

  const res = await db.query.users.findFirst({
    where: { email: parsed.data.email },
    columns: { id: true },
  });
  if (res === undefined) return null;

  return res.id;
}
