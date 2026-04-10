import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div>⏳ Loading...</div>;

  // ❌ ไม่ใช่ admin
  if (!user || user.email !== "johthathaifood@gmail.com") {
    return <Navigate to="/" />;
  }

  return children;
}