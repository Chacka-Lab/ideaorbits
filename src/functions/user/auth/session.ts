import { query } from '@solidjs/router';

import logger from '~/lib/logger';
import * as sessionTokenCookie from '~/modules/cookies/session-token';
import { type Session, verify } from '~/modules/user/auth/session';

type VerifyResult =
  | {
      success: true;
      data: Session;
    }
  | {
      success: false;
      message: 'invalidToken' | 'internalError';
    };

export const verifyCookieToken = query(async (): Promise<VerifyResult> => {
  'use server';
  try {
    // Get token from cookie
    const token = sessionTokenCookie.get();
    if (!token) return { success: false, message: 'invalidToken' };
    // Verify token
    const res = await verify(token);
    if (res) {
      return { success: true, data: res };
    } else {
      sessionTokenCookie.del();
      return { success: false, message: 'invalidToken' };
    }
  } catch (e) {
    logger.error('functions/.../session:verify error:', e);
    return { success: false, message: 'internalError' };
  }
}, 'user/auth/session:verifyCookieToken');
