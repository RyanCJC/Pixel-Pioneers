"use client";
import React, { useState, useEffect } from "react";

const MintTokenModal = ({ onSubmit, onClose, loggedInWalletAddress }) => {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [totalMinted, setTotalMinted] = useState(0); // State to keep track of total minted amount
  const contractAddress = "0x1172DfA5Afd52D46617d7693DEe911887c33B4C9";
  const fallbackUrl = "https://postman-echo.com/post?";

  // State to manage transaction feedback
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  const predefinedAmounts = [10, 20, 30, 40, 50];

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setIsCustomAmount(false);
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
    setIsCustomAmount(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = isCustomAmount ? customAmount : selectedAmount;

    if (!finalAmount) {
      setTransactionError("Amount is required");
      setTransactionStatus("failed");
      return;
    }

    try {
      setTransactionStatus("pending");

      // Submit the transaction to the smart contract
      const response = await onSubmit({
        walletAddress: loggedInWalletAddress, // Use logged-in wallet address
        to: loggedInWalletAddress, // Mint to the same wallet
        amount: finalAmount,
        contractAddress,
        fallbackUrl,
      });

      // Assuming the response includes a transaction hash
      setTransactionHash(response.transactionHash);

      // Set up listeners for callback responses
      listenForCallback(response.transactionHash);
    } catch (error) {
      setTransactionError("Transaction submission failed");
      setTransactionStatus("failed");
    }
  };

  const listenForCallback = (txHash) => {
    setTimeout(() => {
      const successResponse = {
        status: 200,
        result: {
          transactionHash: txHash,
          nonce: 752,
          from: loggedInWalletAddress,
          status: "success",
          receipt: {},
        },
      };

      const failResponse = {
        status: 200,
        result: {
          transactionHash: txHash,
          nonce: 752,
          from: loggedInWalletAddress,
          status: "failed",
          message: "Error message",
        },
      };

      const callbackResponse = Math.random() > 0.5 ? successResponse : failResponse;

      handleCallbackResponse(callbackResponse);
    }, 3000);
  };

  const handleCallbackResponse = (response) => {
    if (response.result.status === "success") {
      setTransactionStatus("success");
      const mintedAmount = isCustomAmount ? parseInt(customAmount) : selectedAmount;
      setTotalMinted((prev) => prev + mintedAmount); // Update the total minted amount
    } else if (response.result.status === "failed") {
      setTransactionStatus("failed");
      setTransactionError(response.result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-96 w-3/4">
        <h2 className="text-2xl font-bold mb-8">Mint Token</h2>
        <p className="mb-4">Total AGC Minted: {totalMinted}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Amount</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {predefinedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountSelection(amt)}
                  className={`px-4 py-2 border rounded-md ${selectedAmount === amt ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {amt} AGC
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomAmount(true)}
                className={`px-4 py-2 border rounded-md ${isCustomAmount ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Others
              </button>
            </div>
            {isCustomAmount && (
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmount}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter custom amount"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Mint
            </button>
          </div>
        </form>

        {/* Feedback message based on transaction status */}
        {transactionStatus === "pending" && <p>Transaction is pending...</p>}
        {transactionStatus === "success" && <p>Transaction successful!</p>}
        {transactionStatus === "failed" && (
          <p>Transaction failed: {transactionError}</p>
        )}
      </div>
    </div>
  );
};

export default MintTokenModal;
