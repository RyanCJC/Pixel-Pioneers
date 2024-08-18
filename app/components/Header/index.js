"use client";
import React, { useState } from "react";
import CreateWalletModal from "../Create-wallet";
import MintTokenModal from "../Mint-token";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [isCreateWalletModalOpen, setIsCreateWalletModalOpen] = useState(false);
  const [isMintTokenModalOpen, setIsMintTokenModalOpen] = useState(false);

  const openCreateWalletModal = () => {
    setIsCreateWalletModalOpen(true);
  };

  const closeCreateWalletModal = () => {
    setIsCreateWalletModalOpen(false);
  };

  const openMintTokenModal = () => {
    setIsMintTokenModalOpen(true);
  };

  const closeMintTokenModal = () => {
    setIsMintTokenModalOpen(false);
  };

  const handleCreateWalletSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create-user`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();
      const walletAddress = result.result.wallet.wallet_address;

      sessionStorage.setItem("walletAddress", walletAddress);

      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }

      toast.success(
        `🦄 User created successfully!
        Wallet address: ${walletAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      closeCreateWalletModal();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("🦄 Error creating user", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleMintTokenSubmit = async (data) => {
    try {
      // Example toast notification for minting success
      toast.success("🦄 Token minted successfully!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      closeMintTokenModal();
    } catch (error) {
      console.error("Error minting token:", error);
      toast.error("🦄 Error minting token", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <header className="w-full py-6 lg:py-4 relative border-b bg-gradient-to-r from-green-400 via-green-500 to-green-600">
      <div className="container mx-auto px-8 lg:px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          Decentralized Agriculture Sustainability Platform
        </h1>
        <div>
          <button
            onClick={openCreateWalletModal}
            className="bg-white border-2 border-green-500 rounded-full py-2 px-6 hover:bg-green-700 hover:text-white text-green-600 font-semibold transition-all duration-300 shadow-lg"
          >
            {typeof window !== "undefined" &&
            window.sessionStorage.getItem("walletAddress") ? (
              <span className="text-sm">
                {`${window.sessionStorage
                  .getItem("walletAddress")
                  .slice(0, 6)}...${window.sessionStorage
                  .getItem("walletAddress")
                  .slice(-4)}`}
              </span>
            ) : (
              "Create Wallet"
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isCreateWalletModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <CreateWalletModal
              onSubmit={handleCreateWalletSubmit}
              onClose={closeCreateWalletModal}
            />
          </motion.div>
        )}
        {isMintTokenModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MintTokenModal
              onSubmit={handleMintTokenSubmit}
              onClose={closeMintTokenModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </header>
  );
};

export default Header;
