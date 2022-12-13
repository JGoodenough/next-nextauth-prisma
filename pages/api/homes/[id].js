import withServerAuth from '@/lib/server.with-auth';
import { prisma } from '@/services/prisma';
import { supabase } from '@/services/supabase';
import { getSession } from 'next-auth/react';

const handler = withServerAuth(async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedHomes: true },
  });

  // Check if authenticated user is the owner of this home
  const { id } = req.query;
  if (!user?.listedHomes?.find((home) => home.id === id)) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  // Update home
  switch (req.method) {
    case 'PATCH':
      try {
        const home = await prisma.home.update({
          where: { id },
          data: req.body,
        });
        res.status(200).json(home);
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Something went wrong' });
      }
      break;
    case 'DELETE':
      try {
        const home = await prisma.home.delete({
          where: { id },
        });
        // Remove image from Supabase storage
        if (home.image) {
          const path = home.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1];
          await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .remove([path]);
        }
        res.status(200).json(home);
      } catch (e) {
        console.error('DELETE ERROR', e);
        res.status(500).json({ message: 'Something went wrong' });
      }
      break;
    default:
      res.setHeader('Allow', ['PATCH']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
  }
});

export default handler;
