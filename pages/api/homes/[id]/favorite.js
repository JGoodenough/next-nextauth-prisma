import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import withServerAuth from '@/lib/server.with-auth';

const handler = withServerAuth(async function handler(req, res) {
  // TODO: Check if user is authenticated

  // TODO: Retrieve home ID from request
  const { id } = req.query;

  switch (req.method) {
    // TODO: Add home to favorite
    case 'PUT':
      break;
    // TODO: Remove home from favorite
    case 'DELETE':
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
