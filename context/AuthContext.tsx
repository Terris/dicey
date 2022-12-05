import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextProps {
  loading: boolean;
  error: string | null;
  user: User | null;
  signIn: () => void;
  signOut: () => void;
}

const initialProps = {
  loading: false,
  error: null,
  user: null,
  signIn: () => null,
  signOut: () => null,
};

export const AuthContext = createContext<AuthContextProps>(initialProps);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
  }, []);

  function signIn() {
    setLoading(true);
    setError(null);
    return signInAnonymously(auth)
      .then((res) => {
        return res.user;
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function signOut() {
    setError(null);
    setUser(initialProps.user);
  }

  return (
    <AuthContext.Provider value={{ loading, error, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
