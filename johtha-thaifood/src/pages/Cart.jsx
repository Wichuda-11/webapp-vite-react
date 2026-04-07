import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, total, increaseQty, decreaseQty, removeItem } = useCart();
  const navigate = useNavigate();

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
      {cart.length === 0 && (
        <div style={emptyBox}>
          ยังไม่มีสินค้าในตะกร้า
        </div>
      )}

      {/* Items */}
      <div style={{ marginTop: 20 }}>
        {cart.map(item => (
          <div key={item.id} style={card}>
            <img src={item.imageUrl} alt="" style={image} />

            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              <p style={priceText}>{item.price} บาท</p>

              {/* Qty control */}
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

            {/* Right */}
            <div style={{ textAlign: "right" }}>
              <b>{item.price * item.qty} ฿</b>

              <br />

              <button
                onClick={() => removeItem(item.id)}
                style={removeBtn}
              >
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
          <b style={{ color: "#16a34a", fontSize: 20 }}>
            {total} บาท
          </b>
        </div>

        <button style={checkoutBtn}>
          ชำระเงิน
        </button>
      </div>
    </div>
  );
}

/* 🎨 Styles */
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
  background: "#e5e7eb",
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
  background: "#e5e7eb",
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