"use client";
import Layout from "../../components/Layout";
import DonorCardGrid from "../../components/DonorCardGrid";

const DonorsDashboard = () => {

  return (
    <Layout>
      <h2 className="text-xl">Welcome to the Donors Dashboard</h2>
        <DonorCardGrid />
    </Layout>
  );
};

export default DonorsDashboard;
