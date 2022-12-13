import { withServerAuth } from '@/lib/server.with-auth';

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
