import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDocument = async () => {
      setLoading(true);
      setError(null);
      setDocument(null);

      try {
        const docRef = doc(db, docCollection, id);
        const docSnap = await getDoc(docRef);

        if (!active) return;

        if (docSnap.exists()) {
          setDocument({
            ...docSnap.data(),
            id: docSnap.id,
          });
        } else {
          setDocument(null);
          setError("Esta publicação não existe ou foi removida.");
        }
      } catch (error) {
        if (!active) return;

        setDocument(null);
        setError(error.message || "Não foi possível carregar a publicação.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      active = false;
    };
  }, [docCollection, id]);

  return { document, loading, error };
};
