"use client";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { getPostById } from "../../../utils/soroban";
import { useGlobalContext } from '../../../context/GlobalContext';

const FeedingDetails = ({ params }) => {
  const { id } = params;
  const [feeding, setFeeding] = useState(null);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useGlobalContext(); 

  useEffect(() => {
    const fetchFeedingDetails = async () => {
      if (publicKey) {
        try {
          const response = await getPostById(publicKey, id);
          setFeeding(response);
        } catch (error) {
          console.error("Error fetching feeding details:", error);
          // Use static data as fallback
          setFeeding(staticFeeding);
        } finally {
          setLoading(false);
        }
      } else {
        alert("Please connect your wallet to view details.");
        // Fallback to static data
        setFeeding(staticFeeding);
        setLoading(false);
      }
    };

    // Ensure fetchFeedingDetails is called only once
    fetchFeedingDetails();
  }, [id]); // Ensure dependency array is correct

  // Static feeding data for fallback
  const staticFeeding = {
    id,
    title: "Feed the Cats",
    imageUrl: "https://d.newsweek.com/en/full/2050102/stray-cats.jpg",
    wallet: "0x123456789...",
    description: "Help feed the stray cats in the neighborhood.",
    amountRequested: 100,
    amountReceived: 50,
    feederAddress: "GABCDEFH",
    isActive: true,
  };

  // Show loader while data is being fetched
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
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
        </div>
      </Layout>
    );
  }

  // Ensure feeding is defined before rendering
  if (!feeding) {
    return (
      <Layout>
        <div className="container mx-auto">
          <p className="text-center text-gray-700 dark:text-gray-400">
            Feeding details not available.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-col bg-white rounded-lg shadow md:flex-row dark:border-gray-700 dark:bg-gray-800">
          <img
            className="lg:w-1/3 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={feeding.imageUrl}
            alt={feeding.title}
          />
          <div className="flex flex-col p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
              {feeding.title}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 truncate">
              {feeding.description}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 truncate">
              Amount Requested: {feeding.amountRequested} XLM
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 truncate">
              Amount Received: {feeding.amountReceived} XLM
            </p>
            <p className="text-sm text-gray-500 overflow-hidden truncate w-64 truncate">
              Wallet: {feeding.feederAddress}
            </p>
            {/*<button className="bg-green-500 text-white p-2 rounded mt-4 self-end mt-auto">
              Donate Now
            </button>*/}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeedingDetails;
