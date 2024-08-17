import React, { useState, useEffect } from "react";

// Function to fetch wallet categories based on user type
const fetchWalletCategories = async (userType) => {
  try {
    const response = await fetch(`API_URL/api/wallet/wallet-category?user_type=${userType}`, {
      headers: {
        "client_id": "9b16ae5638534ae1961fb370f874b6cc",
        "client_secret": "sk_9b16ae5638534ae1961fb370f874b6cc",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    if (data.status === 200) {
      return data.result;
    }
  } catch (error) {
    console.error("Error fetching wallet categories:", error);
  }
  return [];
};

// Function to create a new wallet category
const createWalletCategory = async (name, userType, subcategoryId = null) => {
  try {
    const response = await fetch("API_URL/api/wallet/wallet-category", {
      method: "POST",
      headers: {
        "client_id": "9b16ae5638534ae1961fb370f874b6cc",
        "client_secret": "sk_9b16ae5638534ae1961fb370f874b6cc",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        user_type: userType,
        subcategory_id: subcategoryId
      })
    });

    const data = await response.json();
    if (data.status === 200) {
      console.log("Wallet category created:", data.result);
      return data.result;
    }
  } catch (error) {
    console.error("Error creating wallet category:", error);
  }
  return null;
};

// Function to activate a wallet category
const activateWalletCategory = async (categoryId) => {
  try {
    const response = await fetch(`API_URL/api/wallet/wallet-category/${categoryId}/activate`, {
      method: "PUT",
      headers: {
        "client_id": "9b16ae5638534ae1961fb370f874b6cc",
        "client_secret": "sk_9b16ae5638534ae1961fb370f874b6cc",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    if (data.status === 200) {
      console.log("Wallet category activated:", data.result);
      return data.result;
    }
  } catch (error) {
    console.error("Error activating wallet category:", error);
  }
  return null;
};

// Function to deactivate a wallet category
const deactivateWalletCategory = async (categoryId) => {
  try {
    const response = await fetch(`API_URL/api/wallet/wallet-category/${categoryId}/deactivate`, {
      method: "PUT",
      headers: {
        "client_id": "9b16ae5638534ae1961fb370f874b6cc",
        "client_secret": "sk_9b16ae5638534ae1961fb370f874b6cc",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    if (data.status === 200) {
      console.log("Wallet category deactivated:", data.result);
      return data.result;
    }
  } catch (error) {
    console.error("Error deactivating wallet category:", error);
  }
  return null;
};

// Function to delete a wallet category
const deleteWalletCategory = async (categoryId) => {
  try {
    const response = await fetch(`API_URL/api/wallet/wallet-category/${categoryId}`, {
      method: "DELETE",
      headers: {
        "client_id": "9b16ae5638534ae1961fb370f874b6cc",
        "client_secret": "sk_9b16ae5638534ae1961fb370f874b6cc",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    if (data.status === 200) {
      console.log("Wallet category deleted successfully");
      return true;
    }
  } catch (error) {
    console.error("Error deleting wallet category:", error);
  }
  return false;
};

// WalletCategoryComponent with user type selection
const WalletCategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [userType, setUserType] = useState("farmer"); // Default to "farmer"

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchWalletCategories(userType);
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, [userType]);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="farmer"
            checked={userType === "farmer"}
            onChange={handleUserTypeChange}
          />
          Farmer
        </label>
        <label>
          <input
            type="radio"
            value="buyer"
            checked={userType === "buyer"}
            onChange={handleUserTypeChange}
          />
          Buyer
        </label>
      </div>

      <div>
        {/* Render the categories here */}
        {categories.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </div>
    </div>
  );
};

export default WalletCategoryComponent;
