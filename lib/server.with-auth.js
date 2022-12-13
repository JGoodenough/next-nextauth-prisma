import { getSession } from 'next-auth/react';

const withServerAuth = (callback) => {
  return async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    return await callback(req, res);
  };
};

export default withServerAuth;
