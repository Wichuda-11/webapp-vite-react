import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Cart() {
  const { cart, total, increaseQty, decreaseQty, removeItem, clearCart } =
    useCart();

  const navigate = useNavigate();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 fetch address by uid
  const fetchUserAddress = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data?.name) {
          setName(data.name);
        }
        if (data?.address) {
          setAddress(data.address);
        }
      }
    } catch (err) {
      console.error("fetch address error:", err);
    }
  };

  // 🔹 โหลด address อัตโนมัติเมื่อ login
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserAddress(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 เปิด checkout
  const handleCheckout = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      fetchUserAddress(user.uid);
    }

    setIsCheckoutOpen(true);
  };

  const handleUploadOrder = async () => {
  if (!address) {
    alert("กรุณากรอกที่อยู่");
    return;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("กรุณา login ก่อน");
    return;
  }

  try {
    setLoading(true);

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      email: user.email,
      address,
      name,
      items: cart,
      total,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("สั่งซื้อสำเร็จ");

    clearCart();
    setIsCheckoutOpen(false);
    navigate("/");
  } catch (err) {
    console.error(err);
    alert("เกิดข้อผิดพลาด: " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <button onClick={() => navigate("/")} style={backBtn}>
          ← กลับ
        </button>
        <h2 style={{ margin: 0 }}>🛒 ตะกร้าของคุณ</h2>
      </div>

      {/* Empty */}
      {cart.length === 0 && <div style={emptyBox}>ยังไม่มีสินค้าในตะกร้า</div>}

      {/* Items */}
      <div style={{ marginTop: 20 }}>
        {cart.map((item) => (
          <div key={item.id} style={card}>
            <img src={item.imageUrl} alt="" style={image} />

            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              <p style={priceText}>{item.price} EUR</p>

              <div style={qtyBox}>
                <button style={qtyBtn} onClick={() => decreaseQty(item.id)}>
                  -
                </button>

                <span style={{ minWidth: 30, textAlign: "center" }}>
                  {item.qty}
                </span>

                <button style={qtyBtn} onClick={() => increaseQty(item.id)}>
                  +
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <b>{item.price * item.qty} €</b>
              <br />
              <button onClick={() => removeItem(item.id)} style={removeBtn}>
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={summary}>
        <div style={summaryRow}>
          <span>รวมทั้งหมด</span>
          <b style={{ color: "#16a34a", fontSize: 20 }}>{total} EUR</b>
        </div>

        <button style={checkoutBtn} onClick={handleCheckout}>
          ชำระเงิน
        </button>
      </div>

      {/* Modal */}
      {isCheckoutOpen && (
        <div style={modalOverlay}>
          
          <div style={modalBox}>
            <div style={modalHeader}>
              <h3 style={{ margin: 0 }}>💳 ชำระเงิน</h3>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                style={closeBtn}
              >
                ✕
              </button>
            </div>
              

            {/* ✅ Address */}
            <p>ที่อยู่จัดส่ง:</p>
            <textarea
              placeholder="กรอกที่อยู่ของคุณ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: "100%",
                height: 80,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 10,
                boxSizing: "border-box",
              }}
            />

            {/* (optional) แสดง preview address */}

            <p>โอนเงินมาที่:</p>
            <b>ธนาคาร XXX</b>
            <p>เลขบัญชี: 123-456-7890</p>
            <p>ชื่อบัญชี: Johtha Thaifood</p>
            <p>โอนแล้วส่งหลักฐานการโอนทางข้อความ</p>

            <br />
            <button style={confirmBtn} onClick={handleUploadOrder} disabled={loading}>
              {loading ? "⏳ กำลังส่ง..." : "✅ ยืนยันสั่งซื้อ"}
            </button>

            <br />

            <button style={cancelBtn} onClick={() => setIsCheckoutOpen(false)}>ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles */
const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  color: "#6b7280",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const cancelBtn = {
  width: "100%",
  padding: "10px",
  marginTop: 10,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#374151",
  fontSize: 14,
  cursor: "pointer",
};

const confirmBtn = {
  width: "100%",
  padding: "12px",
  marginTop: 12,
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  fontSize: 15,
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(34,197,94,0.3)",
};

const fileBtn = {
  display: "inline-block",
  padding: "10px 14px",
  background: "#f3f4f6",
  border: "1px dashed #9ca3af",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 14,
};

const container = {
  maxWidth: 600,
  margin: "0 auto",
  padding: 20,
  fontFamily: "sans-serif",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 20,
};

const backBtn = {
  background: "#6f6f6fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};

const emptyBox = {
  textAlign: "center",
  color: "#888",
  marginTop: 50,
};

const card = {
  display: "flex",
  gap: 15,
  padding: 15,
  marginBottom: 15,
  borderRadius: 16,
  background: "#fff",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  alignItems: "center",
};

const image = {
  width: 70,
  height: 70,
  objectFit: "cover",
  borderRadius: 10,
};

const priceText = {
  margin: "5px 0",
  color: "#666",
};

const qtyBox = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 8,
};

const qtyBtn = {
  width: 30,
  height: 30,
  borderRadius: 6,
  border: "none",
  background: "#d6d6d6ff",
  cursor: "pointer",
  fontSize: 16,
};

const removeBtn = {
  marginTop: 5,
  background: "none",
  border: "none",
  color: "red",
  cursor: "pointer",
};

const summary = {
  marginTop: 30,
  padding: 20,
  borderRadius: 16,
  background: "#f9fafb",
  boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 15,
};

const checkoutBtn = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};

/* Modal */
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  width: 320,
};
