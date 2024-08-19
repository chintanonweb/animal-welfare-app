"use client";
import Link from "next/link";

const Home = () => {
  return (
    // <div className="flex justify-center items-center min-h-screen bg-gray-200">
    //   <div className="text-center">
    //     <h1 className="text-3 font-bold mb-6">Animal Welfare App</h1>
    //     <div className="flex flex-col gap-2">
    //     <Link href="/auth/register">
    //       <div className="bg-blue-500 text-white py-2 px-4 rounded">Register</div>
    //     </Link>
    //     <Link href="/auth/login">
    //       <div className="bg-blue-500 text-white py-2 px-4 rounded">Login</div>
    //     </Link>
    //     </div>
    //   </div>
    // </div>
    <>
      <section className="flex items-center justify-center h-screen">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
          <div className="flex flex-wrap items-center sm:-mx-3">
            <div className="w-full md:w-1/2 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  <span className="block text-indigo-600 xl:inline">
                    Animal Welfare App
                  </span>
                </h1>
                <h6 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  <span className="block xl:inline">
                    From Your Heart to Their Bowl{" "}
                  </span>
                  <span className="block text-indigo-600 xl:inline">
                    Contribute and Comfort
                  </span>
                </h6>
                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                  Connect with feeders and donors to support animal welfare help
                  feed and care for animals in need.
                </p>
                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                  <Link
                    href="/auth/register"
                    className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                  >
                    Login
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full h-auto overflow-hidden shadow-2xl">
                <img src="https://i.pinimg.com/originals/e5/f9/f7/e5f9f7944a59a873633987222db297c2.jpg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
