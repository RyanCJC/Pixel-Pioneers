"use client";
import React, { useState } from "react";

const MintTokenModal = ({ onSubmit, onClose }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const contractAddress = "0x1172DfA5Afd52D46617d7693DEe911887c33B4C9";
  const fallbackUrl = "https://postman-echo.com/post?";

  // State to manage transaction feedback
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setTransactionStatus("pending");

      // Submit the transaction to the smart contract
      const response = await onSubmit({
        walletAddress,
        to,
        amount,
        contractAddress,
        fallbackUrl,
      });

      // Assuming the response includes a transaction hash
      setTransactionHash(response.transactionHash);

      // Set up listeners for callback responses
      // This assumes there's a function to handle callbacks based on a transaction hash
      listenForCallback(response.transactionHash);
    } catch (error) {
      setTransactionError("Transaction submission failed");
      setTransactionStatus("failed");
    }
  };

  // Function to listen for callbacks and handle responses
  const listenForCallback = (txHash) => {
    // Mocking callback listener (replace with actual callback handling logic)
    setTimeout(() => {
      // Simulate different outcomes
      const successResponse = {
        status: 200,
        result: {
          transactionHash: txHash,
          nonce: 752,
          from: walletAddress,
          status: "success",
          receipt: {}, // Transaction receipt object
        },
      };

      const failResponse = {
        status: 200,
        result: {
          transactionHash: txHash,
          nonce: 752,
          from: walletAddress,
          status: "failed",
          message: "Error message",
        },
      };

      // Mock response: replace with logic to get actual response
      const callbackResponse = Math.random() > 0.5 ? successResponse : failResponse;

      handleCallbackResponse(callbackResponse);
    }, 3000); // Delay to simulate callback time
  };

  const handleCallbackResponse = (response) => {
    if (response.result.status === "success") {
      setTransactionStatus("success");
    } else if (response.result.status === "failed") {
      setTransactionStatus("failed");
      setTransactionError(response.result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-96 w-3/4">
        <h2 className="text-2xl font-bold mb-8">Mint Token</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="walletAddress" className="block mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="to" className="block mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
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
