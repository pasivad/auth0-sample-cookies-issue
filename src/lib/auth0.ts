import { Auth0Client, filterDefaultIdTokenClaims } from '@auth0/nextjs-auth0/server';
import { headers } from 'next/headers';
import type { SessionData, User } from '@auth0/nextjs-auth0/types';

async function getBaseUrl(): Promise<string> {
  // This is safe to use in server components or middleware
  const headersList = await headers();

  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';

  if (!host) throw new Error('Missing host header');

  return `${protocol}://${host}`;
}

/**
 Creates a properly configured Auth0 client with the current request domain.
 Must be called within a React Server Component or middleware context.
*/
export async function getAuth0Client() {
  return new Auth0Client({
    authorizationParameters: {
      scope: 'openid profile email offline_access',
      audience: process.env.AUTH0_AUDIENCE,
    },
    appBaseUrl: await getBaseUrl(),
    // Session configuration
    session: {
      rolling: true,
      absoluteDuration: Number(process.env.AUTH0_SESSION_ABSOLUTE_DURATION),
      inactivityDuration: Number(process.env.AUTH0_SESSION_INACTIVITY_DURATION),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        transient: false,
      },
    },
    async beforeSessionSaved(session: SessionData): Promise<SessionData> {
      const { tokenSet, user, ...rest } = session;

      // Remove the idToken from the tokenSet to minimize cookie size
      delete tokenSet.idToken;

      return {
        tokenSet,
        user: {
          ...filterDefaultIdTokenClaims(user),
          groups: user[`${process.env.AUTH0_DOMAIN}/groups`],
          idpUserId: user[`${process.env.AUTH0_DOMAIN}/external_id`],
        },
        ...rest,
      };
    },
  });
}

export async function getSession() {
  const auth0 = await getAuth0Client();
  return auth0.getSession();
}

export async function getAccessToken() {
  const auth0 = await getAuth0Client();
  return auth0.getAccessToken();
}

export async function updateSession(session: SessionData) {
  const auth0 = await getAuth0Client();
  return auth0.updateSession(session);
}

export async function getAccessTokenForConnection(options: { connection: string }) {
  const auth0 = await getAuth0Client();
  return auth0.getAccessTokenForConnection(options);
}
