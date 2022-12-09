import { PrismaClient } from '@prisma/client';
import { prisma } from '@/services/prisma';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        const { image, title, description, price, guests, beds, baths } =
          req.body;

        const home = await prisma.home.create({
          data: { image, title, description, price, guests, beds, baths },
        });
        res.status(200).json(home);
      } catch (e) {
        res.status(500).json({ message: 'Something went wrong' });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
