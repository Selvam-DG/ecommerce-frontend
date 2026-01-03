import { paymentAPI } from "../lib/api";

export default function Payment() {
  const payCOD = async () => {
    await paymentAPI.cashOnDelivery({});
    alert("Order placed successfully");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      <button
        onClick={payCOD}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Cash on Delivery
      </button>
    </div>
  );
}
