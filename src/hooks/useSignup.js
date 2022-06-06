import { useState, useEffect } from "react";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // Signup User
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log(res.user);
      if (!res) {
        throw new Error("Could not complete signup");
      }

      // Upload User Thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      const imgURL = await img.ref.getDownloadURL();

      // Add Display Name To User
      await res.user.updateProfile({ displayName, photoURL: imgURL });

      // Create User Document
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgURL,
      });

      // Dispatch Login Action
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

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
