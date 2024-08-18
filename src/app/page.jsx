'use client';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Animal Welfare App</h1>
        <div className="flex flex-col gap-2">
        <Link href="/auth/register">
          <div className="bg-blue-500 text-white py-2 px-4 rounded">Register</div>
        </Link>
        <Link href="/auth/login">
          <div className="bg-blue-500 text-white py-2 px-4 rounded">Login</div>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
