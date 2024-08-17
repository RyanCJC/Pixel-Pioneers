import React, { useState, memo } from 'react';

function ProductListing({ products, onBuyClick, isLoading }) {
  const [feedback, setFeedback] = useState('');

  const handleBuyClick = async (productName, productId) => {
    try {
      setFeedback('Processing your purchase...');
      await onBuyClick(productName, productId); // assuming onBuyClick is an async function
      setFeedback('Purchase successful!');
    } catch (error) {
      setFeedback('Error processing purchase. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-sm mt-2">Price: AGC {product.price.toFixed(2)}</p>
          <p className="text-xs mt-1">Smart Cert: {product.smartCert}</p>
          <button
            className={`mt-4 w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 transition-transform duration-200 ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isLoading}
            onClick={() => handleBuyClick(product.name, product.id)}
          >
            {isLoading ? 'Processing...' : 'Purchase'}
          </button>
        </div>
      ))}
      {feedback && (
        <div className="mt-4 text-center text-red-500">
          {feedback}
        </div>
      )}
    </div>
  );
}

export default memo(ProductListing);
