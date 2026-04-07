import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Johtha Thaifood 🍜</h1>

      {products.map(p => (
        <div key={p.id} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
          <img src={p.image} width="150" />
          <h3>{p.name}</h3>
          <p>{p.price} บาท</p>
          <button>เพิ่มลงตะกร้า</button>
        </div>
      ))}
    </div>
  );
}