import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  // 📦 โหลดสินค้า
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  // 🔐 Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔓 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // 💰 รวม
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // ⏳ loading
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  // 🔐 Login
  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Navbar */}
      <div style={headerCard}>
        <h2 style={{ margin: 0, fontWeight: "bold" }}>
          🍱 Johtha Thaifood
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/cart")} style={cartBtn}>
            🛒 <span style={{ marginLeft: 6 }}>({cart.length})</span>
          </button>

          <button onClick={handleLogout} style={logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* 📦 Product */}
      <h2>สินค้า</h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {products.map(p => (
          <div key={p.id} style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 15,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <img src={p.imageUrl} width="120" alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price} ยูโร</p>

            <button
              onClick={() => addToCart(p)}
              style={{
                background: "linear-gradient(135deg, #22c55e, #4ade80)",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              🛒 เพิ่มลงตะกร้า
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// styles
const headerCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  margin: "16px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const cartBtn = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const logoutBtn = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};