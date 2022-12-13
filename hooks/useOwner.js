import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export const useOwner = ({ home = null }) => {
  const { data: session } = useSession();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    (async () => {
      if (session?.user) {
        try {
          const owner = await axios.get(`/api/homes/${home.id}/owner`);
          setIsOwner(owner?.id === session.user.id);
        } catch (e) {
          console.error(e);
          setIsOwner(false);
        }
      }
    })();
  }, [session?.user, home.id]);

  return { isOwner };
};
