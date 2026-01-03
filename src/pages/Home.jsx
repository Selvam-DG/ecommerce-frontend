import { useEffect, useState } from "react";
import { productAPI, cartAPI } from "../lib/api";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated, setCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getProducts().then(res => {
      setProducts(res.data.results || res.data);
    });
  }, []);

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

    await cartAPI.addToCart({ product: product.id, quantity: 1 });
    const cartRes = await cartAPI.getCart();
    setCart(cartRes.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold">{p.name}</h3>
            <p>${p.price}</p>
            <button
              onClick={() => addToCart(p)}
              className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
