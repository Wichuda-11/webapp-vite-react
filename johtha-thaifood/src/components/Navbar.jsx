import { useCart } from "../context/CartContext";

export default function Navbar({ goToCart }) {
  const { cart } = useCart();

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h2>Johtha Thaifood 🍱</h2>

      <button onClick={goToCart}>
        🛒 ({cart.length})
      </button>
    </div>
  );
}