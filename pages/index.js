import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { prisma } from '@/services/prisma';
import { getSession } from 'next-auth/react';

export default function Home({ homes = [], favoriteHomes = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of the best places in the world
      </p>
      <div className="mt-8">
        <Grid homes={homes} favoritedHomes={favoriteHomes} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { favoriteHomes: { include: { home: true } } },
      })
    : null;

  const favoriteHomes = user ? user.favoriteHomes.map((fh) => fh.home) : [];
  const homes = await prisma.home.findMany();
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
      favoriteHomes: JSON.parse(JSON.stringify(favoriteHomes)),
    },
  };
}
