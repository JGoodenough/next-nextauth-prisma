import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { getServerSidePropsWithAuth } from '@/lib/client.with-auth';
import { getSession } from 'next-auth/react';
import { prisma } from '@/services/prisma';

const Homes = ({ homes = [], favoritedHomes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} favoritedHomes={favoritedHomes} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = getServerSidePropsWithAuth(
  async (context) => {
    // Check if user is authenticated
    const session = await getSession(context);

    // Get all homes from the authenticated user
    const homes = await prisma.home.findMany({
      where: { owner: { email: session.user.email } },
      orderBy: { createdAt: 'desc' },
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favoriteHomes: { include: { home: true } } },
    });

    const favoriteHomes = user.favoriteHomes.map((fv) => fv.home);

    return {
      props: {
        homes: JSON.parse(JSON.stringify(homes)),
        favoritedHomes: JSON.parse(JSON.stringify(favoriteHomes)),
      },
    };
  }
);

export default Homes;
