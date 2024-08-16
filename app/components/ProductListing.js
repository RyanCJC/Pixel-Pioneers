import React from "react";
import { toast } from "react-toastify";

export default function ProductListing({ products }) {
  // Add the handlePurchase function here
  const handlePurchase = async (productId) => {
    try {
      // Implement purchasing logic, e.g., transferring tokens
      console.log("Purchasing product with ID:", productId);
      toast.success("Purchase successful!", {
        position: "bottom-center",
        autoClose: 5000,
      });
    } catch (error) {
      toast.error("Failed to complete purchase", {
        position: "bottom-center",
        autoClose: 5000,
      });
    }
  };

  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow-lg">
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p className="text-gray-700">{product.description}</p>
          <p className="font-semibold mt-2">${product.price}</p>
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={() => handlePurchase(product.id)} // Add the click handler here
          >
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
}




