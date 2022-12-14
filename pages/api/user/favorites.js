import { prisma } from '@/services/prisma';
import withServerAuth from '@/lib/server.with-auth';
import { getSession } from 'next-auth/react';

const handler = withServerAuth(async function handler(req, res) {
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    res.status(404).json({ message: 'User no longer exists.' });
  }

  switch (req.method) {
    // Pull User's Favorite homes
    case 'GET':
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { favoriteHomes: { include: { home: true } } },
      });

      const favoriteHomes = user.favoriteHomes.map((fv) => fv.home);

      res
        .status(200)
        .json({ homes: JSON.parse(JSON.stringify(favoriteHomes)) });
      break;
    // HTTP method not supported!
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
  }
});

export default handler;
