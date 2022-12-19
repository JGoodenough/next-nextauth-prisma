import PropTypes from 'prop-types';
import Card from '@/components/Card';
import { ExclamationIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const Grid = ({ homes = [], favoritedHomes = [], openModal = () => {} }) => {
  const isEmpty = homes.length === 0;
  const [userFavoriteHomes, setUserFavoriteHomes] = useState(favoritedHomes);
  const { data: session } = useSession();

  const toggleFavorite = async (id) => {
    if (session?.user) {
      const isFavorite = userFavoriteHomes.some((fh) => fh.id === id);
      if (isFavorite) {
        const newFavoriteHomes = userFavoriteHomes.filter((fh) => fh.id !== id);
        setUserFavoriteHomes(newFavoriteHomes);
        try {
          await axios.delete(`/api/homes/${id}/favorite`);
        } catch (e) {
          toast.error(
            'An error occurred. Unable to save home as favorite at this time.'
          );
          setUserFavoriteHomes(userFavoriteHomes);
        }
      } else {
        const favoriteHome = homes.find((h) => h.id === id);
        setUserFavoriteHomes([...userFavoriteHomes, favoriteHome]);
        try {
          await axios.put(`/api/homes/${id}/favorite`);
        } catch (e) {
          toast.error(
            'An error occurred. Unable to save home as favorite at this time.'
          );
          setUserFavoriteHomes(userFavoriteHomes);
        }
      }
    } else {
      openModal();
    }
  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map((home) => (
        <Card
          key={home.id}
          favorite={userFavoriteHomes.some((fh) => fh.id === home.id)}
          {...home}
          onClickFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};

Grid.propTypes = {
  homes: PropTypes.array,
};

export default Grid;
