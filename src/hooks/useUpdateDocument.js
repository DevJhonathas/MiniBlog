import { useEffect, useReducer, useRef } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

const initialState = {
  loading: false,
  error: null,
};

const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };

    case "UPDATE_DOC":
      return { loading: false, error: null };

    case "ERROR":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const useUpdateDocument = (docCollection) => {
  const [response, dispatch] = useReducer(updateReducer, initialState);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const dispatchIfMounted = (action) => {
    if (isMounted.current) {
      dispatch(action);
    }
  };

  const updateDocument = async (id, data) => {
    dispatchIfMounted({ type: "LOADING" });

    try {
      const docRef = doc(db, docCollection, id);

      await updateDoc(docRef, data);

      dispatchIfMounted({ type: "UPDATE_DOC" });

      return true;
    } catch (error) {
      dispatchIfMounted({
        type: "ERROR",
        payload: error.message || "Não foi possível atualizar a publicação.",
      });

      throw error;
    }
  };

  return { updateDocument, response };
};
