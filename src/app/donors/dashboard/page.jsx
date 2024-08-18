"use client";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import DonorCardGrid from "../../components/DonorCardGrid";
import { getAllPosts } from "../../utils/soroban";

const DonorsDashboard = () => {
  const [publicKey, setPublicKey] = useState("");
  const [feedings, setFeedings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the public key from local storage
    const storedPublicKey = localStorage.getItem("publicKey");
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
      fetchFeedings(storedPublicKey);
    } else {
      alert("Please connect your wallet to proceed.");
      // Use static feedings data if public key is not available
      setFeedings(staticFeedings);
      setLoading(false);
    }
  }, []);

  const fetchFeedings = async (publicKey) => {
    try {
      const response = await getAllPosts(publicKey); // Replace this with your actual API call
      const activeFeedings = response?.filter((feeding) => feeding.isActive);
      setFeedings(activeFeedings.length > 0 ? activeFeedings : staticFeedings);
    } catch (error) {
      console.error("Error fetching feedings:", error);
      setFeedings(staticFeedings); // Fallback to static data on error
    } finally {
      setLoading(false);
    }
  };

  // Static feedings data
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
      imageUrl:
        "https://www.livelaw.in/h-upload/2022/11/16/750x450_444432-1663071834dog.jpeg",
      wallet: "0x987654321...",
      description: "Donate to feed the dogs in the shelter.",
      amountRequested: 200,
      amountReceived: 100,
      isActive: true
    },
    {
      id: 3,
      title: "Feed the Cows",
      imageUrl:
        "https://cdndailyexcelsior.b-cdn.net/wp-content/uploads/2020/03/page8-1-13.jpg",
      wallet: "0x987654321...",
      description: "Donate to feed the cows in the street.",
      amountRequested: 150,
      amountReceived: 75,
      isActive: true
    },
  ];

  return (
    <Layout>
      <h2 className="text-xl">Welcome to the Donors Dashboard</h2>
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
        <DonorCardGrid feedings={feedings} />
      )}
    </Layout>
  );
};

export default DonorsDashboard;
