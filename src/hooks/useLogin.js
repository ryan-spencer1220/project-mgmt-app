import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // Login User
      const res = await projectAuth.signInWithEmailAndPassword(email, password);

      // Update Online Status
      await projectFirestore.collection("users").doc(res.user.uid).update({
        online: true,
      });

      // Dispatch Logout Action
      dispatch({ type: "LOGIN", payload: res.user });

      // Update State
      if (!isCancelled) {
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

  // Cleanup function => Prevents component from unmounting while querying DB
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
};
