// components/FeederCardGrid.jsx
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { getPosts, addPost } from "../utils/stellar"; // Import Stellar functions
import { scval  } from "@stellar/stellar-sdk";
import * as StellarSdk from '@stellar/stellar-sdk';

const FeederCardGrid = () => {
  const initialFeedings = [
    {
      id: 1,
      title: "Feed the Cats",
      image: "https://d.newsweek.com/en/full/2050102/stray-cats.jpg",
      wallet: "0x123456789...",
      description: "Help feed the stray cats in the street.",
    },
    {
      id: 2,
      title: "Feed the Dogs",
      image:
        "https://www.livelaw.in/h-upload/2022/11/16/750x450_444432-1663071834dog.jpeg",
      wallet: "0x987654321...",
      description: "Donate to feed the dogs in the shelter.",
    },
    {
      id: 3,
      title: "Feed the Cows",
      image:
        "https://cdndailyexcelsior.b-cdn.net/wp-content/uploads/2020/03/page8-1-13.jpg",
      wallet: "0x987654321...",
      description: "Donate to feed the cows in the street.",
    },
  ];

  const [feedings, setFeedings] = useState(initialFeedings);
  const [newFeeding, setNewFeeding] = useState({
    title: "",
    image: "",
    wallet: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from Stellar
  const fetchPosts = async () => {
    const result = await getPosts(
      "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV"
    );
    const result_string = StellarSdk.scValToNative(result);
    console.log(result_string);
    
    // const decodedData = scval.decode(result);

    // console.log(decodedData);
    // console.log(result);

    // setFeedings(result);
  };

  const handleInputChange = (e) => {
    setNewFeeding({ ...newFeeding, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isEditing) {
  //     const updatedFeedings = feedings.map((feeding, index) =>
  //       index === currentIndex ? newFeeding : feeding
  //     );
  //     setFeedings(updatedFeedings);
  //     setIsEditing(false);
  //     setCurrentIndex(null);
  //   } else {
  //     setFeedings([...feedings, { ...newFeeding, id: feedings.length + 1 }]);
  //   }
  //   setNewFeeding({ title: "", image: "", wallet: "", description: "" });
  //   setIsModalOpen(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedFeedings = feedings.map((feeding, index) =>
        index === currentIndex ? newFeeding : feeding
      );
      setFeedings(updatedFeedings);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      const createdPost = await addPost(
        "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV",
        1,
        newFeeding.title,
        newFeeding.description,
        newFeeding.wallet,
        0,
        newFeeding.image
      );
      setFeedings([...feedings, createdPost]);
    }
    setNewFeeding({ title: "", image: "", wallet: "", description: "" });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setNewFeeding(feedings[index]);
    setIsEditing(true);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedFeedings = feedings.filter((_, i) => i !== index);
    setFeedings(updatedFeedings);
  };

  const handleAddNewFeeding = () => {
    setNewFeeding({ title: "", image: "", wallet: "", description: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end">
        <div
          onClick={handleAddNewFeeding}
          type="button"
          className="ml-auto text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add Feeding
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedings.map((feeding, index) => (
          <div
            key={index}
            className="w-full bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <img
              src={feeding.image}
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
              <p className="text-sm text-gray-500">{feeding.wallet}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleEdit(index)}
                  type="button"
                  className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
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
              name="image"
              placeholder="Image URL"
              value={newFeeding.image}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="text"
              name="wallet"
              placeholder="Wallet Address"
              value={newFeeding.wallet}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newFeeding.description}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full"
              required
            />
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
