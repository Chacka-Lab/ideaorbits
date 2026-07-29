import 'server-only';

export function slidingRateLimiter(type: string, id: string) {
  return `srl:${type}:{${encodeURIComponent(id)}}`;
}

export function emailVerificationCode(id: string) {
  return `evc:{${id}}`;
}

export function emailVerificationToken(id: string, secretHash: string) {
  return `evt:{${id}}:${secretHash}`;
}

export function oauthSignupToken(secretHash: string) {
  return `oasp:{${secretHash}}`;
}

export function twoFactorToken(userId: string, secretHash: string) {
  return `ofl:{${userId}}:${secretHash}`;
}

export function webauthnChallenge(challenge: string) {
  return `wao:{${challenge}}`;
}

export function totpInvalidedToken(userId: string, token: string) {
  return `tit:{${userId}}:${token}`;
}
