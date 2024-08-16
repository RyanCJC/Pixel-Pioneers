import { useState } from "react";
import ListProductModal from "../components/ListProductModal";
import SmartCertificateForm from "../components/SmartCertificateForm";

export default function SellProduct() {
  const [formData, setFormData] = useState([]);
  const [isListingProduct, setIsListingProduct] = useState(false);

  const handleProductSubmit = async (productData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to list product");
      }

      const newProduct = await response.json();
      // Handle adding the new product to your list or state here

      alert("Product listed successfully!");
    } catch (error) {
      alert("Failed to list product");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="font-bold text-2xl uppercase text-center mb-4">
        Sell Your Product
      </h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upload Product</h2>
        <button
          onClick={() => setIsListingProduct(!isListingProduct)}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          {isListingProduct ? "Cancel" : "List a Product"}
        </button>
      </div>

      {isListingProduct && (
        <ListProductModal onSubmit={handleProductSubmit} />
      )}

      <SmartCertificateForm formData={setFormData} />
    </main>
  );
}