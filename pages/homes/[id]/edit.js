// pages/homes/[id]/edit.js
import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';
import { getServerSidePropsWithAuth } from '@/lib/client.with-auth';
import { prisma } from '@/services/prisma';
import axios from 'axios';
import { getSession } from 'next-auth/react';

const Edit = (home = null) => {
  const editHome = (data) => axios.patch(`/api/homes/${home.id}`, data);
  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">Edit your home</h1>
        <p className="text-gray-500">
          Fill out the form below to update your home.
        </p>
        <div className="mt-8">
          {home ? (
            <ListingForm
              initialValues={home}
              buttonText="Update home"
              redirectPath={`/homes/${home.id}`}
              onSubmit={editHome}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = getServerSidePropsWithAuth(
  async (context) => {
    const session = await getSession(context);

    const redirect = {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { listedHomes: true },
    });

    // Check if authenticated user is the owner of this home
    const id = context.params.id;
    const home = user?.listedHomes?.find((home) => home.id === id);
    if (!home) {
      return redirect;
    }

    return {
      props: JSON.parse(JSON.stringify(home)),
    };
  }
);

export default Edit;
