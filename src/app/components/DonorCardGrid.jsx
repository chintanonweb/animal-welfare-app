"use client";
import Link from "next/link";

const DonorCardGrid = ({ feedings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
      {feedings.map((feeding) => (
        <div
          key={feeding.id}
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
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Amount Requested: {feeding.amountRequested} XLM
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Amount Received: {feeding.amountReceived} XLM
            </p>
            <Link href={`/donors/feeding/${feeding.id}`}>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                View Details
              </button>
            </Link>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-2 ml-2">
              Donate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonorCardGrid;