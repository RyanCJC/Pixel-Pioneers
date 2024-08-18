"use client";
import { useState, useEffect } from "react";
import MintTokenModal from "./components/Mint-token";
import TransferTokenModal from "./components/Transfer-token";
import ListProductModal from "./components/ListProductModal";
import ProductListing from "./components/ProductListing";
import SmartCertificateForm from "./components/SmartCertificateForm";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isListProductModalOpen, setIsListProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [mintedAmount, setMintedAmount] = useState(0);
  const [activeMenu, setActiveMenu] = useState('home');
  const [aboutContent, setAboutContent] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }

    const fetchProducts = async () => {
      setLoading(true);
      const productList = [
        { id: 1, name: "Organic Tomatoes", description: "Freshly harvested organic tomatoes.", price: 3.99 },
        { id: 2, name: "Free-Range Eggs", description: "Farm fresh eggs from free-range hens.", price: 5.49 },
        { id: 3, name: "Local Honey", description: "Pure honey sourced from local beekeepers.", price: 7.99 },
      ];
      setProducts(productList);
      setLoading(false);
    };

    fetchProducts();

    const fetchAboutContent = async () => {
      try {
        setAboutContent("We are committed to promoting sustainable agriculture by leveraging blockchain technology to enhance transparency and efficiency in the supply chain. Our platform connects farmers, suppliers, and consumers, creating a more sustainable and equitable food system.");
        setContactInfo("For inquiries, please reach out to us at support@sustainableagri.com or call us at (123) 456-7890.");
        setFaq([
          "Q: What is Sustainable Agriculture?",
          "A: Sustainable Agriculture aims to maintain the health of the environment while providing a stable food supply through practices that minimize harm and maximize benefits.",
          "Q: How does your platform ensure transparency?",
          "A: We use blockchain technology to record and verify transactions, ensuring all participants in the supply chain can track and validate each step."
        ]);
      } catch (error) {
        console.error("Error fetching about content:", error);
        setAboutContent("Failed to load about content.");
        setContactInfo("Contact information is unavailable.");
        setFaq(["FAQ is unavailable."]);
      }
    };

    fetchAboutContent();
  }, []);

  const openModal = (modalType) => {
    if (modalType === "mint") {
      setIsMintModalOpen(true);
    } else if (modalType === "transfer") {
      setIsTransferModalOpen(true);
    } else if (modalType === "listProduct") {
      setIsListProductModalOpen(true);
    }
  };

  const closeModal = (modalType) => {
    if (modalType === "mint") {
      setIsMintModalOpen(false);
    } else if (modalType === "transfer") {
      setIsTransferModalOpen(false);
    } else if (modalType === "listProduct") {
      setIsListProductModalOpen(false);
    }
  };

  const clearWalletAddress = () => {
    sessionStorage.removeItem("walletAddress");
    setWalletAddress(null);
  };

  const handleMintSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/mint`,
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
        const errorResponse = await response.json();
        throw new Error(`Failed to mint token: ${errorResponse.message || response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Token Minted:", result);
  
      if (result.amount) {
        // Update local minted amount
        setMintedAmount(prevAmount => prevAmount + parseInt(result.amount, 10));
      }
  
      toast.success(`🦄 Token minted successfully! Wallet address: ${walletAddress}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
  
      closeModal("mint");
    } catch (error) {
      console.error("Error minting token:", error);
      toast.error(`🦄 Error minting token: ${error.message}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };  
  
  const handleTransferSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/token-transfer`,
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
        const errorResponse = await response.json();
        throw new Error(`Failed to transfer token: ${errorResponse.message || response.statusText}`);
      }

      const result = await response.json();
      console.log("Token Transferred:", result);

      toast.success(`🦄 Token transferred successfully! Wallet address: ${walletAddress}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      closeModal("transfer");
    } catch (error) {
      console.error("Error transferring token:", error);
      toast.error(`🦄 Error transferring token: ${error.message}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleProductListed = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleBuyClick = async (productName, productId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reward-tokens`, {
        method: "POST",
        headers: {
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          productId,
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to reward token: ${errorResponse.message || response.statusText}`);
      }
  
      const result = await response.json();
      if (result.tokensRewarded) {
        // Update local minted amount based on reward
        setMintedAmount(prevAmount => prevAmount + result.tokensRewarded);
      }
  
      toast.success(`🛒 Successfully bought ${productName}. You have been rewarded ${result.tokensRewarded} tokens!`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error("Error rewarding token:", error);
      toast.error(`🛒 Error rewarding token: ${error.message}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };  

  const handleMenuClick = (menu) => { 
    setActiveMenu(menu);
  };

  return (
    <main
      className="flex min-h-screen flex-col px-4 bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      {/* Navigation Menu */}
      <nav className="flex justify-around py-2 bg-white shadow-lg top-0">
        <button
          onClick={() => handleMenuClick("home")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out 
          ${activeMenu === "home" ? "font-bold text-blue-600 bg-blue-100 shadow-lg" : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"}`}
        >
          Home
          {activeMenu === "home" && <span className="relative inset-x-0 -bottom-1 h-1 bg-blue-600 rounded-full"></span>}
        </button>
  
        <button
          onClick={() => handleMenuClick("products")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out 
          ${activeMenu === "products" ? "font-bold text-blue-600 bg-blue-100 shadow-lg" : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"}`}
        >
          Products
          {activeMenu === "products" && <span className="relative inset-x-0 -bottom-1 h-1 bg-blue-600 rounded-full"></span>}
        </button>
  
        <button
          onClick={() => handleMenuClick("wallet")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out 
          ${activeMenu === "wallet" ? "font-bold text-blue-600 bg-blue-100 shadow-lg" : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"}`}
        >
          Wallet
          {activeMenu === "wallet" && <span className="relative inset-x-0 -bottom-1 h-1 bg-blue-600 rounded-full"></span>}
        </button>
  
        <button
          onClick={() => handleMenuClick("certificate")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out 
          ${activeMenu === "certificate" ? "font-bold text-blue-600 bg-blue-100 shadow-lg" : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"}`}
        >
          Smart Certificate
          {activeMenu === "certificate" && <span className="relative inset-x-0 -bottom-1 h-1 bg-blue-600 rounded-full"></span>}
        </button>
  
        <button
          onClick={() => handleMenuClick("about")}
          className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out 
          ${activeMenu === "about" ? "font-bold text-blue-600 bg-blue-100 shadow-lg" : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"}`}
        >
          About Us
          {activeMenu === "about" && <span className="relative inset-x-0 -bottom-1 h-1 bg-blue-600 rounded-full"></span>}
        </button>
      </nav>
  
      
      {/* Content Sections */}
      {activeMenu === "home" && (
        <section className="flex flex-col items-center py-8">
          {/* Home Page Content */}
          <h2 className="text-3xl font-bold mb-4">Welcome to the Sustainable Agriculture Platform</h2>
          <p className="text-center text-lg mb-6">
            Our platform aims to revolutionize the agricultural supply chain by leveraging blockchain technology for transparency, efficiency, and sustainability. Join us in making a difference.
          </p>
          <button
            className="px-6 py-3 text-white font-semibold bg-blue-600 rounded-full hover:bg-blue-500 hover:scale-105 transition-colors mb-4"
            onClick={() => handleMenuClick("products")}
          >
            Explore Products
          </button>
          <button
            className="px-6 py-3 text-white font-semibold bg-green-600 rounded-full hover:bg-green-500 hover:scale-105 transition-colors"
            onClick={() => handleMenuClick("about")}
          >
            Learn More About Us
          </button>
        </section>
      )}
      {activeMenu === "products" && (
        <section className="flex flex-col items-center py-8">
          {/* Products Content */}
          <h2 className="text-3xl font-bold mb-4">Products</h2>
          <button
            className="px-6 py-3 text-white font-semibold bg-blue-600 rounded-full hover:bg-blue-500 hover:scale-105 -colors mb-6"
            onClick={() => openModal("listProduct")}
          >
            List Product
          </button>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm16 0a8 8 0 00-16 0 8 8 0 0016 0z"></path>
              </svg>
            </div>
          ) : (
            <ProductListing
              products={products}
              onBuyClick={handleBuyClick}
            />
          )}
        </section>
      )}
      {activeMenu === "wallet" && (
        <section className="flex flex-col items-center py-8">
          {/* Wallet Content */}
          <h2 className="text-3xl font-bold mb-4">Wallet</h2>

          {/* Square Container */}
          <div className="w-100 h-40 bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div>
              <p className="text-lg font-semibold">Owner Name: John Doe</p>
              <p className="text-lg">Wallet Name: Main Wallet</p>
              <p className="text-lg">Wallet Address: {walletAddress}</p>
            </div>
          </div>

          {/* Buttons arranged horizontally outside the square */}
          <div className="flex justify-between w-full max-w-xs mt-6">
            <button
              className={`flex-1 px-6 py-3 text-white font-semibold rounded-full transition-transform transform 
                ${isMintModalOpen ? "bg-blue-600" : "bg-blue-500"} 
                hover:bg-blue-600 hover:scale-105 mx-2`}
              onClick={() => openModal("mint")}
            >
              Mint Tokens
            </button>
            <button
              className={`flex-1 px-6 py-3 text-white font-semibold rounded-full transition-transform transform 
                ${isTransferModalOpen ? "bg-blue-600" : "bg-blue-500"} 
                hover:bg-blue-600 hover:scale-105 mx-2`}
              onClick={() => openModal("transfer")}
            >
              Transfer Tokens
            </button>
          </div>

        </section>
      )}

      {activeMenu === "certificate" && (
        <section className="flex flex-col items-center py-8">
          {/* Certificate Content */}
          <h2 className="text-3xl font-bold mb-4">Smart Certificate</h2>
          <SmartCertificateForm />
        </section>
      )}
      {activeMenu === "about" && (
        <section className="flex flex-col items-center py-8">
          {/* About Content */}
          <div className="relative p-6 rounded-lg shadow-md">
            <div className="absolute inset-0 bg-gray-200 rounded-lg opacity-70"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-center">About Us</h2>
              <p className="text-lg text-center mb-8">{aboutContent}</p>
              <h3 className="text-3xl font-bold mb-4 text-center">Contact Us</h3>
              <p className="text-lg text-center mb-8">{contactInfo}</p>
              <h3 className="text-3xl font-bold mb-4 text-center">FAQ</h3>
              <ul className="list-disc pl-5">
                {faq.map((item, index) => (
                  <li key={index} className="text-lg mb-2">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isMintModalOpen && (
          <MintTokenModal
            isOpen={isMintModalOpen}
            onClose={() => closeModal("mint")}
            onSubmit={handleMintSubmit}
          />
        )}
        {isTransferModalOpen && (
          <TransferTokenModal
            isOpen={isTransferModalOpen}
            onClose={() => closeModal("transfer")}
            onSubmit={handleTransferSubmit}
          />
        )}
        {isListProductModalOpen && (
          <ListProductModal
            isOpen={isListProductModalOpen}
            onClose={() => closeModal("listProduct")}
            onProductListed={handleProductListed}
          />
        )}
      </AnimatePresence>
      <ToastContainer />
    </main>
  );
}
