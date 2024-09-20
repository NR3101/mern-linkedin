import Layout from "./components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import { Loader } from "lucide-react";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  // Using useQuery to fetch the authenticated user info from the server
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"], //it is used to cache the data and avoid multiple requests
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        toast.error(error.response.data.message || "Something went wrong");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100 dark:bg-gray-900">
        <Loader className="w-8 h-8 animate-spin text-gray-700 dark:text-gray-300" />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/network"
          element={authUser ? <NetworkPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
    </Layout>
  );
}

export default App;
