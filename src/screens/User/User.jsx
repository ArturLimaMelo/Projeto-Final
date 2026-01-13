import styles from "./User.module.css";
import { SessionContext } from "../../context/SessionContext";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export default function User() {
  const { session } = useContext(SessionContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserData() {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", session.user.id)
      .single();

      if (error) {
      console.error("Erro ao buscar usuário:", error);
    } else {
      setUserData(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchUserData();
  }, [session]);

  if (loading) return <p>Loading user data...</p>;

  return (
    <>
      <h1>User Page</h1>
      <p>Welcome to the User page, {userData.name}!</p>
    </>
  );
}
