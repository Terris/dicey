import { useAuth } from "../../context/AuthContext";
import styles from "./UserMenu.module.scss";
export default function UserMenu() {
  const { user, signOut } = useAuth();
  return (
    <>
      {user ? (
        <button className={styles.button} onClick={signOut}>
          Logout
        </button>
      ) : null}
    </>
  );
}
