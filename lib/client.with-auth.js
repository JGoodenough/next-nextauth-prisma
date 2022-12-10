import { getSession } from 'next-auth/react';

export const withAuth = (callback) => {
  return async (context) => {
    const redirect = {
      destination: '/',
      permanent: false,
    };
    try {
      // Check if user is authenticated
      const session = await getSession(context);

      // If not, redirect to the homepage
      if (!session) {
        return { redirect };
      }

      return await callback(context);
    } catch (err) {
      return { redirect };
    }
  };
};
