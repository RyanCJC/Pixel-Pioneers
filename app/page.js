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
        setMintedAmount((prevAmount) => prevAmount + parseInt(result.amount, 10));
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
    <main className="flex min-h-screen flex-col px-4 bg-gray-100">
      {/* Navigation Menu */}
      <nav className="flex justify-around py-4 bg-gray-200 shadow-md">
        <button
          onClick={() => handleMenuClick("home")}
          className={`text-lg ${activeMenu === "home" ? "font-bold text-blue-600" : "text-gray-700" }`}
        >
          Home
        </button>
        <button
          onClick={() => handleMenuClick("products")}
          className={`text-lg ${activeMenu === "products" ? "font-bold text-blue-600" : "text-gray-700"}`}
        >
          Products
        </button>
        <button
          onClick={() => handleMenuClick("wallet")}
          className={`text-lg ${activeMenu === "wallet" ? "font-bold text-blue-600" : "text-gray-700"}`}
        >
          Wallet
        </button>
        <button
          onClick={() => handleMenuClick("certificate")}
          className={`text-lg ${activeMenu === "certificate" ? "font-bold text-blue-600" : "text-gray-700"}`}
        >
          Smart Certificate
        </button>
        <button
          onClick={() => handleMenuClick("about")}
          className={`text-lg ${activeMenu === "about" ? "font-bold text-blue-600" : "text-gray-700"}`}
        >
          About Us
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
            className="px-6 py-3 text-white font-semibold bg-blue-600 rounded-full hover:bg-blue-500 transition-colors mb-4"
            onClick={() => handleMenuClick("products")}
          >
            Explore Products
          </button>
          <button
            className="px-6 py-3 text-white font-semibold bg-green-600 rounded-full hover:bg-green-500 transition-colors"
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
            className="px-6 py-3 text-white font-semibold bg-blue-600 rounded-full hover:bg-blue-500 transition-colors mb-6"
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
          <button
            className="px-6 py-3 text-white font-semibold bg-blue-600 rounded-full hover:bg-blue-500 transition-colors mb-4"
            onClick={() => openModal("mint")}
          >
            Mint Tokens
          </button>
          <button
            className="px-6 py-3 text-white font-semibold bg-blue-600 rounded-full hover:bg-blue-500 transition-colors"
            onClick={() => openModal("transfer")}
          >
            Transfer Tokens
          </button>
          <p className="text-lg mt-4">Your current token balance: {mintedAmount}</p>
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
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg text-center mb-6">{aboutContent}</p>
          <h3 className="text-2xl font-semibold mt-6">Contact Us</h3>
          <p className="text-lg text-center mb-6">{contactInfo}</p>
          <h3 className="text-2xl font-semibold mt-6">FAQ</h3>
          <ul className="list-disc pl-5">
            {faq.map((item, index) => (
              <li key={index} className="text-lg mb-2">{item}</li>
            ))}
          </ul>
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
