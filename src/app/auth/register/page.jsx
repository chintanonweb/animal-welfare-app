"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Donor");
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
      role,
    };

    localStorage.setItem("user", JSON.stringify(user));

    router.push("/auth/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
        >
          <option value="Feeder">Feeder</option>
          <option value="Donor">Donor</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Register
        </button>
        <Link href="/auth/login">
          <div className="mt-2 flex justify-end font-medium text-blue-600 dark:text-blue-500 hover:underline">
            Login
          </div>
        </Link>
      </form>
    </div>
  );
};

export default Register;
