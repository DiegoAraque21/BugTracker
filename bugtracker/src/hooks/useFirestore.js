import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { useState, useEffect, useReducer } from 'react';
import { db, timestamp } from '../firebase/config';

let initialState = {
  user: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, success: false, document: null, error: null };
    case 'ADDED_DOC':
      return {
        isPending: false,
        success: true,
        document: action.payload,
        error: null,
      };
    case 'DELETED_DOC':
      return { isPending: false, success: true, document: null, error: null };
    case 'UPDATE_DOC':
      return {
        isPending: false,
        success: true,
        document: action.payload,
        error: null,
      };
    case 'ERROR':
      return {
        isPending: false,
        success: false,
        document: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (c) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  let ref = collection(db, c);

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDoc = await addDoc(ref, { ...doc, createdAt });
      dispatchIfNotCancelled({ type: 'ADDED_DOC', payload: addedDoc });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not add' });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      await deleteDoc(doc(db, c, id));
      dispatchIfNotCancelled({ type: 'DELETED_DOC' });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' });
    }
  };

  // update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const updateCollectionRef = doc(db, c, id);
      const updatedDoc = await updateDoc(updateCollectionRef, updates);
      dispatchIfNotCancelled({ type: 'UPDATE_DOC', payload: updatedDoc });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not update' });
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => setIsCancelled(true);
  }, []);

  return { response, addDocument, deleteDocument, updateDocument };
};
