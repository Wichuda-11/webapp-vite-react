import { useCart } from "../context/CartContext";

export default function Cart({ goBack }) {
  const { cart, total } = useCart();

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      {/* 🔙 Back */}
      <button
        onClick={goBack}
        style={{
          marginBottom: 20,
          background: "none",
          border: "none",
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        ← กลับ
      </button>

      <h2 style={{ marginBottom: 20 }}>🛒 ตะกร้าของคุณ</h2>

      {/* ❌ Empty */}
      {cart.length === 0 && (
        <div style={{ textAlign: "center", color: "#888" }}>
          ยังไม่มีสินค้า
        </div>
      )}

      {/* 📦 Items */}
      {cart.map(item => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 15,
            padding: 12,
            borderRadius: 12,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            background: "#fff"
          }}
        >
          {/* 🖼️ Image */}
          <img
            src={item.imageUrl}
            alt={item.name}
            width="70"
            height="70"
            style={{ borderRadius: 10, objectFit: "cover" }}
          />

          {/* 📄 Info */}
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>{item.name}</h4>
            <p style={{ margin: "5px 0", color: "#666" }}>
              {item.price} บาท
            </p>

            {/* ➕➖ Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                style={btnSmall}
                onClick={() =>
                  item.qty > 1 &&
                  (item.qty -= 1) // (เดี๋ยว note ด้านล่าง)
                }
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                style={btnSmall}
                onClick={() =>
                  (item.qty += 1) // (จะอธิบาย)
                }
              >
                +
              </button>
            </div>
          </div>

          {/* 💰 Price + Remove */}
          <div style={{ textAlign: "right" }}>
            <b>{item.price * item.qty} ฿</b>

            <br />

            <button
              style={{
                marginTop: 5,
                background: "none",
                border: "none",
                color: "red",
                cursor: "pointer"
              }}
            >
              ลบ
            </button>
          </div>
        </div>
      ))}

      {/* 💰 Total */}
      <div
        style={{
          marginTop: 20,
          padding: 15,
          borderRadius: 12,
          background: "#f9fafb",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
        }}
      >
        <h3>รวมทั้งหมด</h3>
        <h2 style={{ color: "#16a34a" }}>{total} บาท</h2>

        {/* 🔥 Checkout */}
        <button
          style={{
            width: "100%",
            padding: 12,
            marginTop: 10,
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #22c55e, #4ade80)",
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ชำระเงิน
        </button>
      </div>
    </div>
  );
}

// 🔘 ปุ่มเล็ก
const btnSmall = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: "none",
  background: "#e5e7eb",
  cursor: "pointer"
};