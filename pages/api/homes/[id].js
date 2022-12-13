import { withServerAuth } from '@/lib/server.with-auth';
import { prisma } from '@/services/prisma';
import { supabase } from '@/services/supabase';

export default withServerAuth(async function handler(req, res) {
  const { id } = req.query;
  // Check if authenticated user is the owner of this home
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
        // Remove image from Supabase storage
        if (home.image) {
          const path = home.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1];
          await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .remove([path]);
        }
        res.status(200).json(home);
      } catch (e) {
        res.status(500).json({ message: 'Something went wrong' });
      }
      break;
    case 'DELETE':
      try {
        const home = await prisma.home.delete({
          where: { id },
        });
        res.status(200).json(home);
      } catch (e) {
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
