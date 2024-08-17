"use client";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import FeederCardGrid from "../../components/FeederCardGrid";
import { getPosts } from "../../utils/stellar";

const FeedersDashboard = () => {
  const [feedings, setFeedings] = useState([]);

  useEffect(() => {
    getPost()
  }, []);

  const getPost = async () => {
    await getPosts(
      "GBXEE2WQVDPCQDYWJKDEHPHCFLBIG33IGQQI2AQ47XJ4SZ46BKAEB7BV",
      "get_posts",
      null
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
