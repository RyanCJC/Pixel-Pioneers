"use client";
import React, { useState } from "react";

const RewardTokenModal = ({ onRewardSubmit, onClose, loggedInWalletAddress, productName, productId }) => {
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setTransactionStatus("pending");

      // Submit the transaction to reward tokens
      const response = await onRewardSubmit({
        walletAddress: loggedInWalletAddress,
        productId,
      });

      setTransactionHash(response.transactionHash);
      listenForCallback(response.transactionHash);
    } catch (error) {
      setTransactionError("Reward submission failed");
      setTransactionStatus("failed");
    }
  };

  const listenForCallback = (txHash) => {
    setTimeout(() => {
      const successResponse = {
        status: 200,
        result: {
          transactionHash: txHash,
          status: "success",
        },
      };

      const failResponse = {
        status: 200,
        result: {
          transactionHash: txHash,
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
    } else if (response.result.status === "failed") {
      setTransactionStatus("failed");
      setTransactionError(response.result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-96 w-3/4">
        <h2 className="text-2xl font-bold mb-8">Reward Token</h2>
        <p className="mb-4">Rewarding tokens for purchasing: {productName}</p>
        <form onSubmit={handleSubmit}>
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
              Reward
            </button>
          </div>
        </form>

        {transactionStatus === "pending" && <p>Transaction is pending...</p>}
        {transactionStatus === "success" && <p>Reward successful!</p>}
        {transactionStatus === "failed" && <p>Transaction failed: {transactionError}</p>}
      </div>
    </div>
  );
};

export default RewardTokenModal;
