"use client";
import { useState, useEffect } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { getAllPosts, donate } from "../utils/soroban";
import Link from 'next/link';

// Modal Component
const DonateModal = ({
  isOpen,
  onClose,
  feedingId,
  destinationAddress,
  onDonationSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!amount || !secretKey) {
      alert("Please enter all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Call sendFunds and wait for it to complete
      await sendFunds(destinationAddress, secretKey, amount);

      const storedPublicKey = localStorage.getItem("publicKey");
      if (!storedPublicKey) {
        alert("Please connect your wallet to proceed.");
        return;
      }
      await donate(storedPublicKey, feedingId, amount);

      // Notify user and close modal
      alert("Donation successful!");
      onDonationSuccess();
      onClose();
    } catch (error) {
      console.error("Donation failed", error);
      alert("Donation failed.");
    } finally {
      setLoading(false);
    }
  };

  const sendFunds = async (destinationID, secretKey, amount) => {
    try {
      const sourceKeys = StellarSdk.Keypair.fromSecret(secretKey);
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org"
      );
      const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationID,
            asset: StellarSdk.Asset.native(),
            amount: amount.toString(),
          })
        )
        .addMemo(StellarSdk.Memo.text("Donation"))
        .setTimeout(180)
        .build();

      transaction.sign(sourceKeys);
      await server.submitTransaction(transaction);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      throw error;
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Donate</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Destination Address</label>
          <input
            type="text"
            value={destinationAddress}
            readOnly
            className="block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Amount (XLM)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Secret Key</label>
          <input
            type="text"
            placeholder="Enter your secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDonate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <svg
                aria-hidden="true"
                className="w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              "Donate"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

const DonorCardGrid = () => {
  const staticFeedings = [
    {
      id: 1,
      title: "Feed the Cats",
      imageUrl: "https://d.newsweek.com/en/full/2050102/stray-cats.jpg",
      wallet: "0x123456789...",
      description: "Help feed the stray cats in the street.",
      amountRequested: 100,
      amountReceived: 50,
      isActive: true
    },
    {
      id: 2,
      title: "Feed the Dogs",
      imageUrl: "https://www.livelaw.in/h-upload/2022/11/16/750x450_444432-1663071834dog.jpeg",
      wallet: "0x987654321...",
      description: "Donate to feed the dogs in the shelter.",
      amountRequested: 200,
      amountReceived: 100,
      isActive: true
    },
    {
      id: 3,
      title: "Feed the Cows",
      imageUrl: "https://cdndailyexcelsior.b-cdn.net/wp-content/uploads/2020/03/page8-1-13.jpg",
      wallet: "0x987654321...",
      description: "Donate to feed the cows in the street.",
      amountRequested: 150,
      amountReceived: 75,
      isActive: true
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [currentFeeding, setCurrentFeeding] = useState(null);
  const [feedingsData, setFeedingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the public key from local storage
    const storedPublicKey = localStorage.getItem("publicKey");
    if (storedPublicKey) {
      fetchFeedings(storedPublicKey);
    } else {
      alert("Please connect your wallet to proceed.");
      // Use static feedings data if public key is not available
      setFeedingsData(staticFeedings);
      setLoading(false);
    }
  }, []);

  const fetchFeedings = async (publicKey) => {
    try {
      const response = await getAllPosts(publicKey); // Replace this with your actual API call
      const activeFeedings = response?.filter((feeding) => feeding.isActive);
      setFeedingsData(activeFeedings.length > 0 ? activeFeedings : staticFeedings);
    } catch (error) {
      console.error("Error fetching feedings:", error);
      setFeedingsData(staticFeedings); // Fallback to static data on error
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSuccess = async () => {
    // Fetch all posts after successful donation
    await fetchFeedings(localStorage.getItem("publicKey"));
  };

  return (
    <div>
      {loading ? (
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
          {feedingsData.map((feeding) => (
            <div
              key={feeding.id}
              className="w-full bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <img
                src={feeding.imageUrl}
                alt={feeding.title}
                className="rounded-t-lg w-full h-60 object-cover"
              />
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {feeding.title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {feeding.description}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Amount Requested: {feeding.amountRequested} XLM
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Amount Received: {feeding.amountReceived} XLM
                </p>
                <Link href={`/donors/feeding/${feeding.id}`}>
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    View Details
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setCurrentFeeding({
                      id: feeding.id,
                      address: localStorage.getItem("publicKey") || "",
                    });
                    setModalOpen(true);
                  }}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-2 ml-2"
                >
                  Donate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modalOpen && currentFeeding && (
        <DonateModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          feedingId={currentFeeding.id}
          destinationAddress={currentFeeding.address}
          onDonationSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
};

export default DonorCardGrid;
