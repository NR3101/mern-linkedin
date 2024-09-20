import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, Loader, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
  const queryClient = useQueryClient();

  // query to get the connection status of the user
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionStatus", user._id],
    queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
  });

  // mutation to send a connection request to the user
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent", {
        id: "connection-request-success",
      });
      queryClient.invalidateQueries(["connectionStatus", user._id]);
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || "Failed to send connection request",
        {
          id: "connection-request-error",
        }
      );
    },
  });

  // mutation to accept a connection request
  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted", {
        id: "connection-request-accept-success",
      });
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || "Failed to accept connection request",
        {
          id: "connection-request-accept-error",
        }
      );
    },
  });

  // mutation to reject a connection request
  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected", {
        id: "connection-request-reject-success",
      });
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || "Failed to reject connection request",
        {
          id: "connection-request-reject-error",
        }
      );
    },
  });

  // function to handle the connect button
  const handleConnect = () => {
    if (connectionStatus?.data?.status === "not_connected") {
      sendConnectionRequest(user._id);
    }
  };

  // function to render the buttons based on the connection status
  const renderButtons = () => {
    if (isLoading) {
      return (
        <button className="px-3 py-1 rounded-full text-sm bg-primary text-white flex items-center">
          <Loader className="animate-spin" />
        </button>
      );
    }

    switch (connectionStatus?.data?.status) {
      case "pending":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center"
            disabled
          >
            <Clock size={16} className="mr-1" />
            Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => acceptRequest(connectionStatus.data.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.data.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center"
            disabled
          >
            <UserCheck size={16} className="mr-1" />
            Connected
          </button>
        );
      default:
        return (
          <button
            className="px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center"
            onClick={handleConnect}
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center flex-grow"
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-sm text-base-content dark:text-white">
            {user.name}
          </h3>
          <p className="text-xs text-info dark:text-gray-300">
            {user.headline}
          </p>
        </div>
      </Link>
      {renderButtons()}
    </div>
  );
};
export default RecommendedUser;
