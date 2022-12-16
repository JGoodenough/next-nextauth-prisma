import { prisma } from '@/services/prisma';

export default async function handler(req, res) {
  // Get the home's onwer
  switch (req.method) {
    case 'GET':
      try {
        const { id } = req.query;
        const { owner } = await prisma.home.findUnique({
          where: { id },
          select: { owner: true },
        });
        res.status(200).json(owner);
      } catch (e) {
        res.status(500).json({ message: 'Something went wrong' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
