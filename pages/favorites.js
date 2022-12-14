import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { prisma } from '@/lib/prisma';
import { getServerSidePropsWithAuth } from '@/lib/client.with-auth';

export const getServerSideProps = getServerSidePropsWithAuth(
  async (context) => {
    // TODO
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
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Favorites;
