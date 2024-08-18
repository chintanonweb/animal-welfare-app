"use client";
import Layout from "../../components/Layout";
import FeederCardGrid from "../../components/FeederCardGrid";

const FeedersDashboard = () => {
  return (
    <Layout>
      <h2 className="text-xl">Welcome to the Feeders Dashboard</h2>
        <FeederCardGrid />
    </Layout>
  );
};

export default FeedersDashboard;

