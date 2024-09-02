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

export default function Register(): JSX.Element {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/register/", {
        username,
        email,
        full_name: fullName,
        password,
      });
      console.log("Registration successful:", response.data);
      await router.push("/configuration/warehouse");
    } catch (error) {
      setError("Registration failed");
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
            <b>Create an Account</b>
          </Typography>
          <Typography level="body-sm">Register to get started.</Typography>
        </div>
        <form onSubmit={handleRegister}>
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
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              id="email"
              value={email}
              placeholder="johndoe@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl className="mt-4">
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              id="fullName"
              value={fullName}
              placeholder="John Doe"
              onChange={(e) => setFullName(e.target.value)}
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
            Register
          </Button>
        </form>
        {error !== "" && <p>{error}</p>}
      </Sheet>
    </main>
  );
}
