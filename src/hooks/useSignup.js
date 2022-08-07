import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { db, auth, storage } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  //state
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (displayName, email, password, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      //signup user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not complete signup');
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const img = ref(storage, uploadPath);
      await uploadBytes(img, thumbnail);
      const photoURL = await getDownloadURL(img);
      //add displayName and photoUrl to user
      await updateProfile(auth.currentUser, { displayName, photoURL });

      //create a user document
      const usersCollectionRef = doc(db, 'users', res.user.uid);
      await setDoc(usersCollectionRef, {
        online: true,
        displayName,
        photoURL,
      });
      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        // catch error
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

  return { error, isPending, signup };
};
