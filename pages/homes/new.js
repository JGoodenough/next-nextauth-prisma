import axios from 'axios';
import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';
import { getServerSidePropsWithAuth } from '@/lib/client.with-auth';

const NewHome = () => {
  const addHome = (data) => axios.post('/api/homes', data);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">List your home</h1>
        <p className="text-gray-500">
          Fill out the form below to list a new home.
        </p>
        <div className="mt-8">
          <ListingForm
            buttonText="Add home"
            redirectPath="/"
            onSubmit={addHome}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = getServerSidePropsWithAuth(
  async (context) => {
    return { props: {} };
  }
);

export default NewHome;
