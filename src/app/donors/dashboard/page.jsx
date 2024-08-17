"use client";
import Layout from "../../components/Layout";
import DonorCardGrid from "../../components/DonorCardGrid";

const DonorsDashboard = () => {
  // This data could be fetched from an API or state management
  const feedings = [
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

  return (
    <Layout>
      <h2 className="text-xl">Welcome to the Donors Dashboard</h2>
      {/* Additional Donor-specific content can go here */}
      <DonorCardGrid feedings={feedings} />
    </Layout>
  );
};

export default DonorsDashboard;
