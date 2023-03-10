import withServerAuth from '@/lib/server.with-auth';
import { prisma } from '@/services/prisma';
import { getSession } from 'next-auth/react';

export default withServerAuth(async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  switch (req.method) {
    case 'POST':
      try {
        const { image, title, description, price, guests, beds, baths } =
          req.body;

        // Retrieve the current authenticated user
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        const home = await prisma.home.create({
          data: {
            image,
            title,
            description,
            price,
            guests,
            beds,
            baths,
            userId: user.id,
          },
        });

        res.status(200).json(home);
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Something went wrong' });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
  }
});
