import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Checkout({ cart }) {

  const handleOrder = async () => {
    await addDoc(collection(db, "orders"), {
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      status: "waiting_payment",
      createdAt: serverTimestamp()
    });

    alert("สร้างออเดอร์แล้ว กรุณาโอนเงิน");
  };

  return (
    <div>
      <h2>ชำระเงิน</h2>

      <p>โอนเงิน:</p>
      <h3>กสิกรไทย</h3>
      <p>123-456-7890</p>

      <button onClick={handleOrder}>ยืนยันคำสั่งซื้อ</button>
    </div>
  );
}