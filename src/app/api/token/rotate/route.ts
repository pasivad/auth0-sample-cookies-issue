import { getAccessToken } from '@/lib/auth0';

async function rotate() {
  try {
    await getAccessToken();
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return rotate();
}

export async function GET() {
  return rotate();
}
