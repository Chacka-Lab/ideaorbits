import { APP_NAME } from '~/lib/consts';
import envPublic from '~/lib/env-public';

/**
 * Human-readable title for your website
 */
export const rpName = APP_NAME;

/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
export const rpID = envPublic.SITE_BASE_URL.hostname;

/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
export const origin = envPublic.SITE_BASE_URL.href.replace(/\/$/, '');
