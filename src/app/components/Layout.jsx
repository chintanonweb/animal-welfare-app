"use client";
import { useEffect, useState } from "react";
import { FaBeer, FaChartPie, FaBars } from "react-icons/fa";
import { TbHeartHandshake } from "react-icons/tb";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { checkConnection, retrievePublicKey } from "../utils/Freighter"; // Import functions from freighter module
import { useGlobalContext } from "../context/GlobalContext";

const Layout = ({ children }) => {
  const [user, setUser] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connected, setConnected] = useState(false); // State to track if the user is connected
  const [isConnecting, setIsConnecting] = useState(false); // State to track if the connection is in progress
  const router = useRouter();
  const pathname = usePathname();
  const { publicKey, setPublicKey } = useGlobalContext(); // Use publicKey and setPublicKey from context

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
      connect();
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  async function connect() {
    setIsConnecting(true); // Set isConnecting to true when connection process starts
    try {
      // Check if connection to Freighter is established
      if (await checkConnection()) {
        // Retrieve public key from Freighter
        const publicKey = await retrievePublicKey();
        if (publicKey) {
          console.log(publicKey);

          setPublicKey(publicKey); // Set the retrieved public key
          setConnected(true); // Set connected state to true

          // Store the public key in local storage
          localStorage.setItem("publicKey", publicKey);
        }
      }
    } catch (error) {
      console.error("Error connecting to Freighter:", error); // Log any errors during the connection process
    } finally {
      setIsConnecting(false); // Set isConnecting to false when connection process ends
    }
  }

  const transClass = dropdownOpen ? "block" : "hidden";
  const sidebarClass = sidebarOpen ? "transform-none" : "-translate-x-full";

  return (
    <div className="h-screen">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                <FaBars />
              </button>
              <a href="#" className="flex items-center ms-2 md:me-24">
                <TbHeartHandshake className="me-2 text-2xl dark:text-white" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  {user.role === "Donor"
                    ? "Donor Dashboard"
                    : "Feeder Dashboard"}
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <button
                onClick={connect} // Call the connect function when the button is clicked
                className="text-white overflow-hidden truncate w-40  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                disabled={isConnecting} // Disable the button if the connection is in progress
              >
                {isConnecting
                  ? "Connecting.."
                  : connected
                  ? publicKey
                  : "Connect to Freighter"}{" "}
                {/* Show appropriate button text based on isConnecting state */}
              </button>
              <div className="flex items-center ms-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://mighty.tools/mockmind-api/content/cartoon/31.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  className={`absolute right-0 top-6 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 ${transClass}`}
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      {user.role}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      {user.email}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <Link
                        href={`${
                          user.role === "Donor"
                            ? "/donors/dashboard"
                            : "/feeders/dashboard"
                        }`}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white ${
                          pathname === "/donors/dashboard" ||
                          pathname === "/feeders/dashboard"
                            ? "bg-gray-100 dark:bg-gray-600 dark:text-white"
                            : ""
                        }`}
                        role="menuitem"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white ${
                          pathname === "/profile"
                            ? "bg-gray-100 dark:bg-gray-600 dark:text-white"
                            : ""
                        }`}
                        role="menuitem"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <a
                        onClick={handleLogout}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${sidebarClass}`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href={`${
                  user.role === "Donor"
                    ? "/donors/dashboard"
                    : "/feeders/dashboard"
                }`}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  pathname === "/donors/dashboard" ||
                  pathname === "/feeders/dashboard"
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
              >
                <FaChartPie />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/wallet"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group${
                  pathname === "/wallet"
                    ? "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                <FaBeer />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Wallet & History
                </span>
              </Link>
            </li>
            {/* Add more menu items here */}
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-2 rounded-lg dark:border-gray-700 mt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
