import React, { useState } from 'react';

export default function ListProductModal({ onClose, onProductListed }) {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [smartCert, setSmartCert] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newProduct = {
      id: Date.now(), // Generate a unique ID or use a more robust solution
      name: productName,
      description: `A product with quantity ${quantity}`,
      price: parseFloat(price),
      smartCert: smartCert || "N/A" // Default to "N/A" if no certificate provided
    };

    // Simulate a form submission
    console.log("Listing Product:", newProduct);

    // Notify parent component of the new product
    onProductListed(newProduct);

    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">List a Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Product Name:</span>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Quantity:</span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Price:</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Smart Certificate:</span>
            <input
              type="text"
              value={smartCert}
              onChange={(e) => setSmartCert(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              List Product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
