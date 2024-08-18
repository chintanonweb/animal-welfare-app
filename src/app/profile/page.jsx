"use client";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";

const Profile = () => {
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    organization: "",
    location: "",
    contact: "",
    profileImage: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [user, setUser] = useState(null); // Initialize user state as null

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user");
      const userData = JSON.parse(data);
      setUser(userData); // Set the user data in state

      if (userData) {
        setProfileDetails({
          name: userData.name || "",
          email: userData.email || "",
          organization: userData.organization || "",
          location: userData.location || "",
          contact: userData.contact || "",
          profileImage: userData.profileImage || "",
        });
        setProfileImage(userData.profileImage || "");
      }
    }
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  const handleInputChange = (e) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setProfileDetails({ ...profileDetails, profileImage: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof window !== "undefined" && user) {
      const existingUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...existingUser, ...profileDetails };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("Profile updated:", updatedUser);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Optionally render a loading state
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="mt-4 h-32 w-32 object-cover rounded-full mx-auto"
              />
            )}
            <label className="block text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profileDetails.name}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileDetails.email}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
          {user?.role === "Feeder" && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700">Organization Name</label>
                <input
                  type="text"
                  name="organization"
                  value={profileDetails.organization}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileDetails.location}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={profileDetails.contact}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Update Profile
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
