import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../index.css";
import html2pdf from "html2pdf.js";

export default function AdminPanel() {
  const [tab, setTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  console.log('orders===>',orders)
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [trackingMap, setTrackingMap] = useState({});
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log("items =>", selectedOrder?.items)

  /* ================= AUTH ================= */
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setOrders(data);

    // set tracking map
    const map = {};
    data.forEach((o) => {
      map[o.id] = o.trackingNo || "";
    });
    setTrackingMap(map);
  };

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setProducts(data);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  /* ================= ORDER ================= */
  const updateOrder = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status,
      trackingNo: trackingMap[id] || "",
    });

    alert("อัปเดตแล้ว");
    fetchOrders();
  };

  // 🔓 Logout
  const handleLogout = async () => {
    const auth = getAuth();
      await signOut(auth);
    };

  /* ================= PRODUCT ================= */
  const handleSaveProduct = async () => {
    if (!name || !price) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    if (editingId) {
      await updateDoc(doc(db, "products", editingId), {
        name,
        stock: Number(stock),
        price: Number(price),
      });
      alert("แก้ไขแล้ว");
    } else {
      await addDoc(collection(db, "products"), {
        name,
        stock: Number(stock),
        price: Number(price),
        createdAt: serverTimestamp(),
      });
      alert("เพิ่มสินค้าแล้ว");
    }

    setName("");
    setStock("");
    setPrice("");
    setEditingId(null);

    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("ลบสินค้านี้?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const handleEditProduct = (p) => {
    setName(p.name);
    setStock(p.stock);
    setPrice(p.price);
    setEditingId(p.id);
  };

  const handleDownloadPDF = async () => {
  const buttons = document.querySelectorAll(".no-print-btn");

  // hide buttons
  buttons.forEach((btn) => (btn.style.display = "none"));

  const element = document.getElementById("print-area");

  const opt = {
    margin: 0.5,
    left: 10,
    top: 10,
    filename: `order-${selectedOrder?.id}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  await html2pdf().set(opt).from(element).save();

  // show buttons back
  buttons.forEach((btn) => (btn.style.display = "block"));
};

  /* ================= GUARD ================= */
  if (!user) return <div style={center}>⏳ กำลังโหลด...</div>;

  if (user.email !== "johthathaifood@gmail.com") {
    return <div style={center}>❌ ไม่มีสิทธิ์</div>;
  }

  /* ================= UI ================= */
  return (
    <div style={container}>
      <h2>🧑‍💼 Admin Panel</h2>

      {/* tabs */}
      <div style={tabBar}>
        <button
          style={tab === "orders" ? tabActive : tabBtn}
          onClick={() => setTab("orders")}
        >
          📦 Orders
        </button>

        <button
          style={tab === "products" ? tabActive : tabBtn}
          onClick={() => setTab("products")}
        >
          🛒 Products
        </button>
        <button onClick={handleLogout} style={logoutBtn}>
            Logout
          </button>
      </div>

      {/* ================= ORDERS ================= */}
      {tab === "orders" && (
        <>
          {orders.map((o) => (
            <div key={o.id} style={orderCard}>
              <div style={trackingBox}>
                <div>
                  <p style={label}>Name</p>
                  <b>{o.name}</b>
                </div>

                <span style={statusBadge(o.status)}>{o.status}</span>

                <button
                  style={secondaryBtn}
                  onClick={() => setSelectedOrder(o)}
                >
                  📄 ดูรายละเอียด
                </button>
              </div>

              <p style={address}>{o.address}</p>

              <p>
                <b>💰 {o.total} EUR</b>
              </p>

              {o.slipUrl && <img src={o.slipUrl} style={imgPreview} />}

              <div style={trackingBox}>
                <input
                  placeholder="เลขพัสดุ"
                  value={trackingMap[o.id] || ""}
                  disabled={o.status === "shipped"}
                  onChange={(e) =>
                    setTrackingMap({
                      ...trackingMap,
                      [o.id]: e.target.value,
                    })
                  }
                  style={input}
                />

                <button
                  style={primaryBtn}
                  onClick={() => updateOrder(o.id, "shipped")}
                  disabled={o.status === "shipped"}
                >
                  🚚 ส่งแล้ว
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ================= PRODUCTS ================= */}
      {tab === "products" && (
        <>
          <div style={productForm}>
            <input
              placeholder="ชื่อสินค้า"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={input}
            />

            <input
              type="number"
              placeholder="ราคา"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={input}
            />

            <input
              type="number"
              placeholder="จำนวนสินค้า"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={input}
            />

            <button style={primaryBtn} onClick={handleSaveProduct}>
              {editingId ? "💾 อัปเดตสินค้า" : "➕ เพิ่มสินค้า"}
            </button>
          </div>

          {products.map((p) => (
            <div key={p.id} style={productCard}>
              {p.imageUrl && <img src={p.imageUrl} style={imgPreview} />}

              <div style={{ flex: 1 }}>
                {/* <h4>{p.name}</h4> */}
                <p style={{ color: "#16a34a" }}>{p.name}</p>
                <p style={{ color: "#16a34a" }}>{p.price} EUR</p>
                <p style={{ color: "#16a34a" }}>{p.stock} ชิ้น</p>
              </div>

              <button style={editBtn} onClick={() => handleEditProduct(p)}>
                ✏️
              </button>

              <button
                style={deleteBtn}
                onClick={() => handleDeleteProduct(p.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </>
      )}
      {selectedOrder && (
        <div style={modalOverlay} >
          <div style={modalBox} id="print-area">
            <h3>📄 Order Detail</h3>

            <p>
              <b>Email:</b> {selectedOrder.email}
            </p>
            <p>
              <b>ที่อยู่:</b> {selectedOrder.address}
            </p>
            <p>
              <b>สถานะ:</b> {selectedOrder.status}
            </p>

            <hr />

            <h4>รายการสินค้า</h4>

            {selectedOrder.items?.map((item, index) => (
              <div key={index} style={itemRow}>
                {/* <img src={item.imageUrl} style={itemImg} /> */}

 
                <b>{item.name} :</b>
                <b>จำนวน: {item.qty}</b>
                <b>ราคา: {item.price} €</b>
                  
                  {/* <p>{item.name}</p>
                  <p>ราคา: {item.price} €</p>
                  <p>จำนวน: {item.qty}</p> */}


                <b>รวม: {item.price * item.qty} €</b>
              </div>
            ))}

            <hr />

            <h3 style={{ textAlign: "right", fontWeight: "bold" }}>
                รวมราคาทั้งหมด: {selectedOrder.total} €
            </h3>

            {/* ปุ่ม */}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="no-print-btn" style={printBtn} onClick={handleDownloadPDF}>
                🖨 Print
              </button>

              <button className="no-print-btn" style={cancelBtn} onClick={() => setSelectedOrder(null)}>
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const center = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const container = {
  padding: 10,
  //maxWidth: 800,
  margin: "0 auto",
};

const secondaryBtn = {
  marginTop: 10,
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  background: "#b2b2b2ff",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

// const modalBox = {
//   background: "#fff",
//   padding: 20,
//   borderRadius: 12,
//   width: 400,
//   maxHeight: "80vh",
//   overflowY: "auto",
// };
const modalBox = {
  background: "#fff",
  padding: 10,
  borderRadius: 12,
  width: "90%",   // ✅ เปลี่ยน
  maxHeight: "80vh",
  overflowY: "auto",
};

const itemRow = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 10,
};

const itemImg = {
  width: 50,
  height: 50,
  borderRadius: 8,
  objectFit: "cover",
};

const printBtn = {
  flex: 1,
  padding: 10,
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const tabBar = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
};

const tabBtn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#b2b2b2ff",
  cursor: "pointer",
};

const tabActive = {
  ...tabBtn,
  background: "#22c55e",
  color: "#fff",
  border: "none",
};

const orderCard = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: 15,
//   width: "100%",        // ✅ เพิ่ม
};

const orderTop = {
  display: "flex",
  justifyContent: "space-between",
};

const label = {
  fontSize: 12,
  color: "#888",
};

const address = {
  margin: "8px 0",
};

const trackingBox = {
  display: "flex",
  gap: 10,
  marginTop: 5,
};

const input = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#22c55e",
  color: "#fff",
  cursor: "pointer",
};

const productForm = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 20,
};

const productCard = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 12,
  background: "#fff",
  borderRadius: 12,
  marginBottom: 10,
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

const imgPreview = {
  width: 100,
  borderRadius: 10,
};

const editBtn = {
  background: "#facc15",
  border: "none",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

const deleteBtn = {
  background: "#ef4444",
  border: "none",
  padding: "6px 10px",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
};

const fileInput = {
  padding: 8,
};

const cancelBtn = {
  padding: "10px 16px",
  background: "#b2b2b2ff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const statusBadge = (status) => ({
  fontSize: 12,
  marginTop: 10,
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background:
    status === "shipped"
      ? "#bbf7d0"
      : status === "pending"
        ? "#fde68a"
        : "#e5e7eb",
});
