import { oauthProvider } from '~/lib/schema/auth';

export const oauthProviders = oauthProvider.enumValues;
export type OAuthProvider = (typeof oauthProviders)[number];
