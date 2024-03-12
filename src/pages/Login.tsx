import React, { useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../utils/axiosConfig";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

export default function Login(): JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/token",
        `username=${username}&password=${password}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      console.log("Login successful:", response.data);
      sessionStorage.setItem("token", response.data.access_token as string);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;

      await router.push("/configuration/warehouse");
    } catch (error) {
      setError("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        {error !== "" && <p>{error}</p>}
      </form>
    </div>
  );
}
