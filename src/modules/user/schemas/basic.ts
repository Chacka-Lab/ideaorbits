import { z } from 'zod';

import type { ValueOf } from '~/utils/types';

const displayNameRe = /^[^\p{C}\p{Zl}\p{Zp}]+$/u;
const usernameRe = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

const ERR_MESSAGES = {
  displayName: {
    bad: 'displayNameBad',
    tooShort: 'displayNameTooShort',
    tooLong: 'displayNameTooLong',
    invalid: 'displayNameInvalid',
  },
  username: {
    bad: 'usernameBad',
    tooShort: 'usernameTooShort',
    tooLong: 'usernameTooLong',
    invalid: 'usernameInvalid',
  },
  email: {
    bad: 'emailBad',
    tooLong: 'emailTooLong',
    invalid: 'emailInvalid',
  },
  password: {
    bad: 'passwordBad',
    tooShort: 'passwordTooShort',
    tooLong: 'passwordTooLong',
  },
} as const;

export type DisplayNameErr = ValueOf<typeof ERR_MESSAGES.displayName>;
export const displayNameErrArr = Object.values(ERR_MESSAGES.displayName);
export type UsernameErr = ValueOf<typeof ERR_MESSAGES.username>;
export const usernameErrArr = Object.values(ERR_MESSAGES.username);
export type EmailErr = ValueOf<typeof ERR_MESSAGES.email>;
export const emailErrArr = Object.values(ERR_MESSAGES.email);
export type PasswordErr = ValueOf<typeof ERR_MESSAGES.password>;
export const passwordErrArr = Object.values(ERR_MESSAGES.password);

export const displayNameSchema = z.object({
  displayName: z
    .string(ERR_MESSAGES.displayName.bad)
    .min(1, ERR_MESSAGES.displayName.tooShort)
    .max(50, ERR_MESSAGES.displayName.tooLong)
    .regex(displayNameRe, ERR_MESSAGES.displayName.invalid)
    .transform((val) => val.normalize()),
});
export type DisplayName = z.infer<typeof displayNameSchema>;

export const usernameSchema = z.object({
  username: z
    .string(ERR_MESSAGES.username.bad)
    .trim()
    .min(3, ERR_MESSAGES.username.tooShort)
    .max(50, ERR_MESSAGES.username.tooLong)
    .regex(usernameRe, ERR_MESSAGES.username.invalid),
});
export type Username = z.infer<typeof usernameSchema>;

export const emailSchema = z.object({
  email: z
    .string(ERR_MESSAGES.email.bad)
    .trim()
    .max(255, ERR_MESSAGES.email.tooLong)
    .pipe(z.email(ERR_MESSAGES.email.invalid)),
});
export type Email = z.infer<typeof emailSchema>;

export const passwordSchema = z.object({
  password: z
    .string(ERR_MESSAGES.password.bad)
    .min(8, ERR_MESSAGES.password.tooShort)
    .max(300, ERR_MESSAGES.password.tooLong),
});
export type Password = z.infer<typeof passwordSchema>;
