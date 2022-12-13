import { getSession } from 'next-auth/react';

export const withServerAuth = async (callback) => {
  return async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    return await callback(req, res);
  };
};
