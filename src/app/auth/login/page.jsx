"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    
    if (user && user.password === password) {
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "Feeder") {
        router.push("/feeders/dashboard");
      } else if (user.role === "Donor") {
        router.push("/donors/dashboard");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
        <Link href="/auth/register">
          <div className="mt-2 flex justify-end font-medium text-blue-600 dark:text-blue-500 hover:underline">
            Register
          </div>
        </Link>
      </form>
    </div>
  );
};

export default Login;
