"use client";
import Layout from "../components/Layout";
import { useState } from "react";
import { createAndFundWallet } from "../utils/stellar";
import Account from "../components/Account";

const Wallet = () => {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState({
    publicKey: "",
    secretKey: "",
  });
  const [inputKeys, setInputKeys] = useState({
    publicKey: "",
    secretKey: "",
  });
  const [copySuccess, setCopySuccess] = useState({
    publicKey: false,
    secretKey: false,
  });

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const { publicKey, secretKey } = await createAndFundWallet();
      setWallet({ publicKey, secretKey });
    } catch (error) {
      console.error("Failed to create and fund wallet:", error);
    }
    setLoading(false);
  };

  const handleUseExistingWallet = () => {
    if (inputKeys.publicKey && inputKeys.secretKey) {
      setWallet(inputKeys);
    } else {
      alert("Please enter both public and secret keys.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputKeys((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(wallet[key]).then(() => {
      setCopySuccess((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setCopySuccess((prev) => ({ ...prev, [key]: false })),
        2000
      );
    });
  };

  return (
    <Layout>
      <h2 className="text-xl">Wallet & History</h2>
      <div className="w-full">
        {!wallet.publicKey ? (
          <div className="p-8 bg-white rounded-lg shadow-lg max-w-sm">
            <button
              onClick={handleCreateWallet}
              disabled={loading}
              className="w-full px-4 py-2 mb-4 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating Wallet..." : "Create Wallet"}
            </button>
            <div className="my-4 text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Or Use an Existing Wallet
              </h3>
              <input
                type="text"
                name="publicKey"
                placeholder="Enter Public Key"
                value={inputKeys.publicKey}
                onChange={handleChange}
                className="w-full px-3 py-2 mb-2 text-sm border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
              <input
                type="text"
                name="secretKey"
                placeholder="Enter Secret Key"
                value={inputKeys.secretKey}
                onChange={handleChange}
                className="w-full px-3 py-2 mb-4 text-sm border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                onClick={handleUseExistingWallet}
                className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
              >
                Use Existing Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="p-8 bg-white rounded-lg shadow-lg w-1/3">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Your Wallet Information
              </h3>
              <div className="mb-4">
                <p className="truncate">
                  <strong>Public Key:</strong> {wallet.publicKey}
                </p>
                <button
                  onClick={() => handleCopy("publicKey")}
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {copySuccess.publicKey ? "Copied!" : "Copy Public Key"}
                </button>
              </div>
              <div className="mb-4">
                <p className="truncate">
                  <strong>Secret Key:</strong> {wallet.secretKey}
                </p>
                <button
                  onClick={() => handleCopy("secretKey")}
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {copySuccess.secretKey ? "Copied!" : "Copy Secret Key"}
                </button>
              </div>
            </div>
            <div className="w-2/3">
              <Account wallet={wallet} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wallet;
