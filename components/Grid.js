import PropTypes from 'prop-types';
import Card from '@/components/Card';
import { ExclamationIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Grid = ({ homes = [], favoritedHomes = [] }) => {
  const isEmpty = homes.length === 0;
  const [userFavoriteHomes, setUserFavoriteHomes] = useState(favoritedHomes);

  // useEffect(() => {
  //   const fetchUserFavoriteHomes = async () => {
  //     try {
  //       const {
  //         data: { homes },
  //       } = await axios.get('/api/user/favorites');
  //       setUserFavoriteHomes(homes);
  //     } catch (e) {
  //       toast.error('Unable to fetch user favorite homes.');
  //     }
  //   };
  //   fetchUserFavoriteHomes();
  // }, []);

  const toggleFavorite = async (id) => {
    const isFavorite = userFavoriteHomes.some((fh) => fh.id === id);
    if (isFavorite) {
      const newFavoriteHomes = userFavoriteHomes.filter((fh) => fh.id !== id);
      setUserFavoriteHomes(newFavoriteHomes);
      await axios.delete(`/api/homes/${id}/favorite`);
    } else {
      try {
        const favoriteHome = homes.find((h) => h.id === id);

        setUserFavoriteHomes([...userFavoriteHomes, favoriteHome]);
        await axios.put(`/api/homes/${id}/favorite`);
      } catch (e) {
        toast.error(
          'An error occurred. Unable to save home as favorite at this time.'
        );
        setUserFavoriteHomes(homes);
      }
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
