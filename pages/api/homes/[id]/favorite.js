import { prisma } from '@/services/prisma';
import withServerAuth from '@/lib/server.with-auth';
import { getSession } from 'next-auth/react';

const handler = withServerAuth(async function handler(req, res) {
  const { id } = req.query;
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  switch (req.method) {
    case 'PUT':
      try {
        const home = await prisma.home.update({
          where: { id: id },
          data: {
            favoriteUsers: {
              create: [
                {
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                  assignedAt: new Date(),
                },
              ],
            },
          },
        });
        res.status(200).json(home);
      } catch (e) {
        console.error(`PUT /api/user/favorite: ${e}`);
        res.status(500).json({ message: 'Something went wrong.' });
      }
      break;
    case 'DELETE':
      try {
        await prisma.userFavoriteHomes.delete({
          where: {
            userId_homeId: {
              userId: user.id,
              homeId: id,
            },
          },
        });
        res.status(204);
      } catch (e) {
        console.error(`DELETE /api/user/favorite: ${e}`);
        res.status(500).json({ message: 'Something went wrong.' });
      }
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
