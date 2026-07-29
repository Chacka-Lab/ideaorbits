import 'server-only';

import * as webauthn from '@simplewebauthn/server';
import { eq } from 'drizzle-orm';

import db from '~/lib/db';
import { userPasskeys } from '~/lib/schema/auth';
import * as webauthnChallenge from '~/modules/redis/webauthn-challenge';
import { origin, rpID, rpName } from '~/modules/user/auth/webauthn-config';

// ===== Request Register =====

type RequestRegisterResult =
  | {
      success: true;
      data: PublicKeyCredentialCreationOptionsJSON;
    }
  | {
      success: false;
      message: 'userUnavailable';
    };

export async function requestRegister(userId: string): Promise<RequestRegisterResult> {
  const user = await db.query.users.findFirst({
    where: { id: userId, status: 'active' },
    columns: { username: true, displayName: true },
    with: {
      passkeys: {
        columns: { id: true, transports: true },
      },
    },
  });
  if (!user) {
    return {
      success: false,
      message: 'userUnavailable',
    };
  }

  return {
    success: true,
    data: await webauthn.generateRegistrationOptions({
      rpName,
      rpID,
      userName: user.username,
      userID: Buffer.from(userId, 'utf-8'),
      userDisplayName: user.displayName,
      challenge: await webauthnChallenge.create(),
      attestationType: 'none',
      excludeCredentials: user.passkeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports ?? undefined,
      })),
    }),
  };
}

// ===== Verify Register =====

type Response = webauthn.VerifiedRegistrationResponse['registrationInfo'];

export async function register(
  body: webauthn.RegistrationResponseJSON,
  challenge: string,
): Promise<Response | null> {
  const ok = await webauthnChallenge.consume(challenge);
  if (!ok) return null;

  const verification = await webauthn.verifyRegistrationResponse({
    response: body,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified) {
    return verification.registrationInfo;
  }
  return null;
}

// ===== Request Auth =====

type Credentials = {
  id: webauthn.Base64URLString;
  transports?: webauthn.AuthenticatorTransportFuture[];
}[];

export async function requestAuth(
  allowCredentials?: Credentials,
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  return await webauthn.generateAuthenticationOptions({
    rpID,
    challenge: await webauthnChallenge.create(),
    allowCredentials,
  });
}

// ===== Verify Auth =====

type VerifyAuthResult =
  | {
      success: true;
      userId: string;
    }
  | {
      success: false;
      message: 'invalidDevice' | 'invalidAuth';
    };

export async function auth(
  body: webauthn.AuthenticationResponseJSON,
  challenge: string,
): Promise<VerifyAuthResult> {
  if (!(await webauthnChallenge.consume(challenge))) {
    return { success: false, message: 'invalidAuth' };
  }

  const passkey = await db.query.userPasskeys.findFirst({
    where: { id: body.id },
    columns: { publicKey: true, counter: true, transports: true },
    with: {
      user: {
        columns: { id: true, status: true },
      },
    },
  });
  if (!passkey || !passkey.user || passkey.user.status !== 'active') {
    return { success: false, message: 'invalidDevice' };
  }

  const verification = await webauthn.verifyAuthenticationResponse({
    response: body,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: body.id,
      publicKey: new Uint8Array(passkey.publicKey),
      counter: passkey.counter,
      transports: passkey.transports ?? undefined,
    },
  });

  if (verification.verified) {
    await db
      .update(userPasskeys)
      .set({ counter: verification.authenticationInfo.newCounter })
      .where(eq(userPasskeys.id, body.id));

    return { success: true, userId: passkey.user.id };
  }

  return { success: false, message: 'invalidAuth' };
}
