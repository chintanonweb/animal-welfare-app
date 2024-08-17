"use client";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import FeederCardGrid from "../../components/FeederCardGrid";
import { createPost, getAllPosts, getPostById, deletePost, updatePost, donate } from "../../utils/soroban";

const FeedersDashboard = () => {
  const [feedings, setFeedings] = useState([]);

  const handleAddPost = async () => {
    try {
      const caller = "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV";
      const title = "Feed Cats";
      const description = "Providing food";
      const walletAddress = "GABCDEFH";
      const amountRequested = 100;
      const imageUrl = "https://example.com/cat.jpg";

      const postId = await createPost(
        caller,
        title,
        description,
        amountRequested,
        imageUrl,
        walletAddress
      );
      console.log(`Post created with ID: ${postId}`);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleGetPosts = async () => {
    await getAllPosts(
      "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV"
    ).then((values) => console.log(values));
    // await deletePost(
    //   "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV", 1
    // );
    // await getPostById(
    //   "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV", 1
    // ).then((values) => console.log(values));
    // await updatePost(
    //   "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV",
    //   2,
    //   "Updated Feed Cats",
    //   "Providing food to more cats",
    //   150,
    //   "https://example.com/new-cat.jpg",
    //   false
    // );
  };
  const handleDeletePosts = async () => {
    await donate(
      "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV",
      3,
      50
    );
    // await deletePost("YOUR_CALLER_ADDRESS", 3)
    //   .then((result) => console.log("Post deleted:", result))
    //   .catch((error) => console.error("Error:", error));
  };

  const addFeeding = (newFeeding) => {
    setFeedings([...feedings, newFeeding]);
  };

  const editFeeding = (index, updatedFeeding) => {
    const updatedFeedings = feedings.map((feeding, i) =>
      i === index ? updatedFeeding : feeding
    );
    setFeedings(updatedFeedings);
  };

  const deleteFeeding = (index) => {
    const updatedFeedings = feedings.filter((_, i) => i !== index);
    setFeedings(updatedFeedings);
  };

  return (
    <Layout>
      <h2 className="text-xl">Welcome to the Feeders Dashboard</h2>
      <button onClick={handleAddPost}>Add Post</button> <br />
      <br />
      <button onClick={handleGetPosts}>Get Posts</button>
      <br />
      <br />
      <button onClick={handleDeletePosts}>donate Posts</button>
      {/* Additional Feeder-specific content can go here */}
      <FeederCardGrid
        feedings={feedings}
        addFeeding={addFeeding}
        editFeeding={editFeeding}
        deleteFeeding={deleteFeeding}
      />
    </Layout>
  );
};

export default FeedersDashboard;
