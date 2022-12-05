import { RiSettings5Fill } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const { user } = useAuth();

  if (!user) return null;
  return <RiSettings5Fill size={30} />;
}
