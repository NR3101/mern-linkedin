import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  // login mutation using react-query
  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      // invalidate the authUser query to fetch the latest data so that we can redirect to home page
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong", {
        id: "login-error",
      });
    },
  });

  // function to handle the login process
  const handleLogin = (e) => {
    e.preventDefault();
    // call the loginMutation function to login the user
    login({ username, password });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        required
      />

      <button type="submit" className="btn btn-primary w-full text-white">
        {isPending ? <Loader className="size-5 animate-spin" /> : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
