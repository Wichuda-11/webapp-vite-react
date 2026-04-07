// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db, auth } from "./firebase/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import Login from "./pages/Login";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [page, setPage] = useState("login");

//   // 📦 โหลดสินค้า
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const querySnapshot = await getDocs(collection(db, "products"));
//       const data = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setProducts(data);
//     };

//     fetchProducts();
//   }, []);

//   // 🔐 Auth
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setPage("products");
//       } else {
//         setPage("login");
//       }
//     });

//     return () => unsub();
//   }, []);

//   // ➕ เพิ่มสินค้า
//   const addToCart = (product) => {
//     setCart(prev => {
//       const exist = prev.find(item => item.id === product.id);

//       if (exist) {
//         return prev.map(item =>
//           item.id === product.id
//             ? { ...item, qty: item.qty + 1 }
//             : item
//         );
//       }

//       return [...prev, { ...product, qty: 1 }];
//     });
//   };

//   // ➖ ลดจำนวน
//   const decreaseQty = (id) => {
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id && item.qty > 1
//           ? { ...item, qty: item.qty - 1 }
//           : item
//       )
//     );
//   };

//   // ❌ ลบ
//   const removeItem = (id) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   // 🔓 Logout
//   const handleLogout = async () => {
//     await signOut(auth);
//   };

//   // 💰 รวม
//   const totalPrice = cart.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   // 🔐 หน้า Login
//   if (page === "login") {
//     return <Login onLoginSuccess={() => setPage("products")} />;
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       {/* Navbar */}
//       <div style={headerCard}>
//         {/* Left */}
//         <h2 style={{ margin: 0, fontWeight: "bold" }}>
//           🍱 Johtha Thaifood
//         </h2>

//         {/* Right */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <button onClick={() => setPage("cart")} style={cartBtn}>
//             🛒 <span style={{ marginLeft: 6 }}>({cart.length})</span>
//           </button>

//           <button onClick={handleLogout} style={logoutBtn}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* 📦 Product */}
//       {page === "products" && (
//         <>
//           <h2>สินค้า</h2>

//           <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//             {products.map(p => (
//               <div key={p.id} style={{
//                 border: "1px solid #eee",
//                 borderRadius: 12,
//                 padding: 15,
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
//               }}>
//                 <img src={p.imageUrl} width="120" />
//                 <h3>{p.name}</h3>
//                 <p>{p.price} ยูโร</p>

//                 <button
//                   onClick={() => addToCart(p)}
//                   style={{
//                     background: "linear-gradient(135deg, #22c55e, #4ade80)",
//                     color: "white",
//                     border: "none",
//                     padding: "10px 18px",
//                     borderRadius: "10px",
//                     cursor: "pointer"
//                   }}
//                 >
//                   🛒 เพิ่มลงตะกร้า
//                 </button>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* 🛒 Cart */}
//       {page === "cart" && (
//         <>
//           <button onClick={() => setPage("products")}>← กลับ</button>

//           <h2>ตะกร้า</h2>

//           {cart.map(item => (
//             <div key={item.id}>
//               {item.name} × {item.qty}

//               <div>
//                 <button onClick={() => decreaseQty(item.id)}>-</button>
//                 <button onClick={() => addToCart(item)}>+</button>
//                 <button onClick={() => removeItem(item.id)}>ลบ</button>
//               </div>
//             </div>
//           ))}

//           <h3>รวม: {totalPrice} ยูโร</h3>
//         </>
//       )}
//     </div>
//   );
// }

// const headerCard = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: "16px 20px",
//   margin: "16px",
//   borderRadius: "16px",
//   boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
// };

// const cartBtn = {
//   padding: "10px 14px",
//   borderRadius: "10px",
//   border: "none",
//   background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
//   color: "white",
//   cursor: "pointer",
//   fontWeight: "bold",
// };

// const logoutBtn = {
//   padding: "10px 14px",
//   borderRadius: "10px",
//   border: "none",
//   background: "#ef4444",
//   color: "white",
//   cursor: "pointer",
//   fontWeight: "bold",
// };

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;