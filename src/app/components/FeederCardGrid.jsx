import { useState, useEffect } from "react";
import Modal from "./Modal";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePostPermanently,
} from "../utils/soroban";
import { useGlobalContext } from '../context/GlobalContext';

const FeederCardGrid = () => {
  const initialFeedings = [
    {
      id: 1,
      title: "Feed the Cats",
      imageUrl: "https://d.newsweek.com/en/full/2050102/stray-cats.jpg",
      feederAddress: "GAYV3OQFSIJVDN4ZST6MHNX24PQCDJSZBDRG367YJ2L4MRYC5SGLUV3K",
      description: "Help feed the stray cats in the street.",
      amountRequested: 100,
      amountReceived: 50,
      isActive: true,
    },
    {
      id: 2,
      title: "Feed the Dogs",
      imageUrl:
        "https://www.livelaw.in/h-upload/2022/11/16/750x450_444432-1663071834dog.jpeg",
      feederAddress: "GAYV3OQFSIJVDN4ZST6MHNX24PQCDJSZBDRG367YJ2L4MRYC5SGLUV3K",
      description: "Donate to feed the dogs in the shelter.",
      amountRequested: 200,
      amountReceived: 100,
      isActive: true,
    },
    {
      id: 3,
      title: "Feed the Cows",
      imageUrl:
        "https://cdndailyexcelsior.b-cdn.net/wp-content/uploads/2020/03/page8-1-13.jpg",
      feederAddress: "GAYV3OQFSIJVDN4ZST6MHNX24PQCDJSZBDRG367YJ2L4MRYC5SGLUV3K",
      description: "Donate to feed the cows in the street.",
      amountRequested: 150,
      amountReceived: 75,
      isActive: true,
    },
  ];

  const [feedings, setFeedings] = useState([]);
  const [newFeeding, setNewFeeding] = useState({
    title: "",
    imageUrl: "",
    feederAddress: "",
    description: "",
    amountRequested: 0,
    amountReceived: 0,
    isActive: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { publicKey } = useGlobalContext(); 

  useEffect(() => {
    // Retrieve the public key from local storage
    if (publicKey) {
      fetchAllPosts(publicKey);
    } else {
      alert("Please connect your wallet to proceed. Static data will be displayed instead.");
      // Use static feedings data if public key is not available
      setFeedings(initialFeedings);
      setLoading(false);
    }
  }, []);

  const fetchAllPosts = async (publicKey) => {
    setLoading(true);
    try {
      const posts = await getAllPosts(publicKey);
      setFeedings(posts?.length > 0 ? posts : initialFeedings);
    } catch (err) {
      console.log("Failed to fetch posts.", err);
      alert("Failed to fetch posts.");
      setFeedings(initialFeedings); // Fallback to static data on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFeeding({
      ...newFeeding,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!publicKey) {
        console.error("No public key found in localStorage");
        return;
      }

      if (isEditing) {
        await updatePost(
          publicKey,
          newFeeding.id,
          newFeeding.title,
          newFeeding.description,
          newFeeding.amountRequested,
          newFeeding.imageUrl,
          !newFeeding.isActive
        );
      } else {
        const postId = await createPost(
          publicKey,
          newFeeding.title,
          newFeeding.description,
          newFeeding.amountRequested,
          newFeeding.imageUrl,
          newFeeding.feederAddress
        );
        console.log(`Post created with ID: ${postId}`);
      }

      fetchAllPosts(publicKey);
      setIsModalOpen(false); // Close the modal after successful submission
    } catch (err) {
      console.log("Failed to submit post.", err);
      alert("Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setNewFeeding(feedings[index]);
    setIsEditing(true);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (index) => {
    setLoading(true);
    try {
      if (!publicKey) {
        console.error("No public key found in localStorage");
        return;
      }

      await deletePostPermanently(publicKey, feedings[index].id);
      fetchAllPosts(publicKey);
    } catch (err) {
      console.log("Failed to delete post.", err);
      alert("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewFeeding = () => {
    setNewFeeding({
      title: "",
      imageUrl: "",
      feederAddress: publicKey,
      description: "",
      amountRequested: 0,
      amountReceived: 0,
      isActive: true,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div>
      <div className="flex items-center justify-end">
        <button
          onClick={() => fetchAllPosts(publicKey)}
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 me-2"
        >
          Reload Data
        </button>
        <div
          onClick={handleAddNewFeeding}
          type="button"
          className="ml-auto text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add Feeding
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedings.length > 0 ? (
          feedings.map((feeding, index) => (
            <div
              key={index}
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
                <p className="text-sm text-gray-500 truncate">
                  {feeding.feederAddress}
                </p>
                <p className="text-sm text-gray-500">
                  Requested: ${feeding.amountRequested}
                </p>
                <p className="text-sm text-gray-500">
                  Received: ${feeding.amountReceived}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {feeding.isActive ? "Active" : "Inactive"}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => handleEdit(index)}
                    type="button"
                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                  >
                    Edit
                  </button>
                  {/* <button
                    onClick={() => handleDelete(index)}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No feedings available</div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          title={isEditing ? "Edit Feeding" : "Add Feeding"}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newFeeding.title}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={newFeeding.imageUrl}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="text"
              name="feederAddress"
              placeholder="Feeder Wallet Address"
              value={newFeeding.feederAddress}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              readOnly
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newFeeding.description}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="number"
              name="amountRequested"
              placeholder="Amount Requested"
              value={newFeeding.amountRequested}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="number"
              name="amountReceived"
              placeholder="Amount Received"
              value={newFeeding.amountReceived}
              className="border p-2 mb-2 w-full"
              readOnly
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="isActive"
                checked={newFeeding.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              Active
            </label>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {isEditing ? "Update Feeding" : "Add Feeding"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeederCardGrid;
