import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";

export const GoogleSignInButton = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  );
};