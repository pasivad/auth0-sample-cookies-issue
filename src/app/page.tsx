'use client';

import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const { user } = useUser();

  const onLogout = () => {
    const logoutUrl = new URL('/auth/logout', window.location.origin);
    // Use full URL for returnTo parameter
    const returnToUrl = new URL('/auth/login', window.location.origin).toString();
    logoutUrl.searchParams.set('returnTo', returnToUrl);
    window.location.href = logoutUrl.toString();
  };

  const callAPI = async () => {
    await fetch('/api/token/rotate')
  }

  return (
    <div className="flex justify-center w-full justify-center pt-[400px]">
      <div className="flex flex-col items-center">
        <span>
          Hey <b>{user?.email}</b>!
        </span>

        <button
          className="bg-red-600 p-2 rounded mt-4 text-white cursor-pointer hover:bg-red-800"
          onClick={onLogout}
        >
          Logout
        </button>
        <button
          className="bg-blue-600 p-2 rounded mt-4 text-white cursor-pointer hover:bg-blue-800"
          onClick={callAPI}
        >
          Call fake API
        </button>
      </div>
    </div>
  );
}
