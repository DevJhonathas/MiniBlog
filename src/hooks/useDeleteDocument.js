import { useEffect, useReducer, useRef } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

const initialState = {
  loading: false,
  error: null,
};

const deleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        error: null,
      };

    case "DELETE_DOC":
      return {
        loading: false,
        error: null,
      };

    case "ERROR":
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const useDeleteDocument = (docCollection) => {
  const [response, dispatch] = useReducer(deleteReducer, initialState);
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

  const deleteDocument = async (id) => {
    dispatchIfMounted({ type: "LOADING" });

    try {
      await deleteDoc(doc(db, docCollection, id));

      dispatchIfMounted({ type: "DELETE_DOC" });

      return true;
    } catch (error) {
      dispatchIfMounted({
        type: "ERROR",
        payload: error.message,
      });

      return false;
    }
  };

  return { deleteDocument, response };
};
