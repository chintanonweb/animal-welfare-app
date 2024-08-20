"use client";
import Link from "next/link";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { LiaDonateSolid } from "react-icons/lia";
import { TbWorldCheck } from "react-icons/tb";

const Home = () => {
  return (
    <>
      <section className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
        <div className="flex flex-wrap items-center sm:-mx-3 pt-12 pb-12">
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
        <div class="flex flex-wrap -m-4">
          <div class="p-4 md:w-1/3">
            <div class="flex rounded-lg h-full bg-gray-100 p-4 px-6 flex-col shadow-lg">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                  <AiOutlineSafetyCertificate />
                </div>
                <h2 class="text-gray-900 text-lg title-font font-medium">
                  Safe And Secure
                </h2>
              </div>
              <div class="flex-grow">
                <p class="leading-relaxed text-base">
                  All the funds are managed with safe smart contracts on
                  Soroban.
                </p>
              </div>
            </div>
          </div>
          <div class="p-4 md:w-1/3">
            <div class="flex rounded-lg h-full bg-gray-100 p-4 px-6 flex-col shadow-lg">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                  <LiaDonateSolid />
                </div>
                <h2 class="text-gray-900 text-lg title-font font-medium">
                  Lowest Fees
                </h2>
              </div>
              <div class="flex-grow">
                <p class="leading-relaxed text-base">
                  Lowest possible fees without any unnecessary third party
                  commissions.
                </p>
              </div>
            </div>
          </div>
          <div class="p-4 md:w-1/3">
            <div class="flex rounded-lg h-full bg-gray-100 p-4 px-6 flex-col shadow-lg">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                  <TbWorldCheck />
                </div>
                <h2 class="text-gray-900 text-lg title-font font-medium">
                  International Accessibility
                </h2>
              </div>
              <div class="flex-grow">
                <p class="leading-relaxed text-base">
                  Users can raise funds from anywhere and donate to anyone.
                  Globaly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
