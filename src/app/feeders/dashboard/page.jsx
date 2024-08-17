"use client";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import FeederCardGrid from "../../components/FeederCardGrid";
import { getPosts, addPost } from "../../utils/soroban";

const FeedersDashboard = () => {
  const [feedings, setFeedings] = useState([]);

  const handleAddPost = async () => {
    const caller = "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV";
    const id = 3;
    const title = "Feed Cats";
    const description = "Providing food";
    const walletAddress = "GABCDEFH";
    const amountRequested = 100;
    const imageUrl = "https://example.com/cat.jpg";

    await addPost(
      caller,
      id,
      title,
      description,
      walletAddress,
      amountRequested,
      imageUrl
    );
  };

  const handleGetPosts = async () => {
    await getPosts(
      "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV"
    ).then((values) => console.log(values));
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
      <button onClick={handleAddPost}>Add Post</button> <br /><br />
      <button onClick={handleGetPosts}>Get Posts</button>
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
