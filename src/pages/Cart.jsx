import { useEffect } from "react";
import { cartAPI } from "../lib/api";
import useStore from "../store/useStore";

export default function Cart() {
  const { cart, setCart } = useStore();

  useEffect(() => {
    cartAPI.getCart().then(res => setCart(res.data));
  }, []);

  if (!cart || cart.items.length === 0) {
    return <p className="text-center mt-10">Cart is empty</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items.map(item => (
        <div key={item.id} className="bg-white p-4 shadow mb-3 flex justify-between">
          <div>
            <h3>{item.product.name}</h3>
            <p>${item.product.price}</p>
          </div>
          <p>Qty: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
}
