import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';

export const useDocument = (c, id) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  //realtime data
  useEffect(() => {
    const ref = doc(collection(db, c), id);

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.data()) {
          setDocuments({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError('No such document exists');
        }
      },
      (err) => {
        console.log(err.message);
        setError('Fail to get documents');
      }
    );

    return () => unsub();
  }, [c, id]);

  return { documents, error };
};
