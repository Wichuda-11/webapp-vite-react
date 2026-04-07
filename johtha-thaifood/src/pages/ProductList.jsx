import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function ProductList({ products, goToCart }) {
  const { addToCart } = useCart();

  return (
    <div>
      <Navbar goToCart={goToCart} />

      <h2>สินค้า</h2>

      {products.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.price} บาท</p>
          <button onClick={() => addToCart(p)}>
            เพิ่มลงตะกร้า
          </button>
        </div>
      ))}
    </div>
  );
}