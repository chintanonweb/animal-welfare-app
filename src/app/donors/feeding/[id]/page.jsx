"use client";
import Layout from "../../../components/Layout";

const FeedingDetails = ({ params }) => {
  const { id } = params;

  // This data should be fetched based on the ID
  const feeding = {
    id,
    title: "Feed the Cats",
    image: "https://d.newsweek.com/en/full/2050102/stray-cats.jpg",
    wallet: "0x123456789...",
    description: "Help feed the stray cats in the neighborhood.",
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-col bg-white rounded-lg shadow md:flex-row dark:border-gray-700 dark:bg-gray-800">
          <img
            className="lg:w-1/3 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={feeding.image}
            alt={feeding.title}
          />
          <div className="flex flex-col p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {feeding.title}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {feeding.description}
            </p>
            <p className="text-sm text-gray-500">Wallet: {feeding.wallet}</p>
            <button className="bg-green-500 text-white p-2 rounded mt-4 self-end mt-auto">
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeedingDetails;
