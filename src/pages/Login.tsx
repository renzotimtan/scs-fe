import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
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
    <main>
      <Sheet
        sx={{
          width: 300,
          mx: "auto",
          my: 14,
          py: 4,
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              id="username"
              value={username}
              placeholder="johndoe"
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl className="mt-4">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              id="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            className="bg-button-primary mt-5 w-full"
            sx={{ mt: 4 }}
            type="submit"
          >
            Log in
          </Button>
        </form>
        {error !== "" && <p>{error}</p>}
      </Sheet>
    </main>
  );
}
