import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { getServerSidePropsWithAuth } from '@/lib/client.with-auth';
import { prisma } from '@/services/prisma';

export const getServerSideProps = getServerSidePropsWithAuth(
  async (context) => {
    const redirect = {
      destination: '/',
      permanent: false,
    };
    const session = await getSession(context);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favoriteHomes: { include: { home: true } } },
    });

    if (!user) {
      return redirect;
    }

    const favoriteHomes = user.favoriteHomes.map((fv) => fv.home);

    return {
      props: { homes: JSON.parse(JSON.stringify(favoriteHomes)) },
    };
  }
);

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} favoritedHomes={homes} />
      </div>
    </Layout>
  );
};

export default Favorites;
