import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  // using react-query to handle the mutation i.e. the signup process
  const { mutate: signUpMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      // invalidate the authUser query to fetch the latest data so that we can redirect to home page
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong", {
        id: "signup-error",
      });
    },
  });

  // function to handle the signup process
  const handleSignup = (e) => {
    e.preventDefault();
    // call the signUpMutation function to sign up the user
    signUpMutation({ name, email, username, password });
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-gray-100"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-gray-100"
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-gray-100"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-gray-100"
      />

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full text-white dark:text-gray-100"
      >
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Sign Up"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
