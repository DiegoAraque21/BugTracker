import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // update online variable
      const usersCollectionRef = doc(db, 'users', userCredentials.user.uid);
      await updateDoc(usersCollectionRef, {
        online: true,
      });

      dispatch({ type: 'LOGIN', payload: userCredentials.user });
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err);
        setIsPending(false);
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, login };
};
