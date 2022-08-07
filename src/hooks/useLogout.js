import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { dispatch, user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const logout = async () => {
    setError(null);
    setIsPending(true);

    // sign the user out
    try {
      const { uid } = user;
      const usersCollectionRef = doc(db, 'users', uid);
      await updateDoc(usersCollectionRef, {
        online: false,
      });

      await signOut(auth);

      // dispatch logout action
      dispatch({ type: 'LOGOUT' });

      if (!isCancelled) {
        //update states
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, []);

  return { logout, isPending, error };
};
