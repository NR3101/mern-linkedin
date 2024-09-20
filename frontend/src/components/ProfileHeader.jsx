import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // query to get the connection status of the user
  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery(
    {
      queryKey: ["connectionStatus", userData._id],
      queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
      enabled: !isOwnProfile,
    }
  );

  // check if the user is connected to the auth user
  const isConnected = userData.connections.some(
    (connection) => connection === authUser._id
  );

  // mutation to send a connection request to the user
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  // mutation to accept a connection request
  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  // mutation to reject a connection request
  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  // mutation to remove a connection
  const { mutate: removeConnection } = useMutation({
    mutationFn: async (userId) =>
      await axiosInstance.delete(`/connections/${userId}`),
    onSuccess: () => {
      toast.success("Connection removed");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  // get the connection state of the user-->using useMemo to prevent unnecessary re-renders
  const getConnectionStatus = useMemo(() => {
    if (isConnected) return "connected";
    if (!isConnected) return "not_connected";

    return connectionStatus?.data?.status;
  }, [isConnected, connectionStatus]);

  const renderConnectionButton = () => {
    const baseClass =
      "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";

    switch (getConnectionStatus) {
      case "connected":
        return (
          <div className="flex gap-2 justify-center">
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className="mr-2" />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={20} className="mr-2" />
              Remove Connection
            </button>
          </div>
        );

      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className="mr-2" />
            Pending
          </button>
        );

      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => acceptRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => sendConnectionRequest(userData._id)}
            className="bg-primary hover:bg-[#004182] text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            <UserPlus size={20} className="mr-2" />
            Connect
          </button>
        );
    }
  };

  // function to handle image change for banner and profile picture
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          [event.target.name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // function to handle save button
  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            editedData.bannerImg || userData.bannerImg || "/banner.png"
          }')`,
        }}
      >
        {isEditing && (
          <label className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow cursor-pointer">
            <Camera size={20} className="text-gray-600 dark:text-gray-300" />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        )}
      </div>

      <div className="p-4">
        <div className="relative -mt-20 mb-4">
          <img
            src={
              editedData.profilePicture ||
              userData.profilePicture ||
              "/avatar.png"
            }
            alt="Profile Picture"
            className="w-32 h-32 rounded-full mx-auto object-cover"
          />

          {isEditing && (
            <label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white dark:bg-gray-700 p-2 rounded-full shadow cursor-pointer">
              <Camera size={20} className="text-gray-600 dark:text-gray-300" />
              <input
                type="file"
                className="hidden"
                name="profilePicture"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedData.name ?? userData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
              className="text-2xl font-bold mb-2 text-center w-full bg-transparent dark:text-white"
            />
          ) : (
            <h1 className="text-2xl mb-2 font-bold dark:text-white">
              {userData.name}
            </h1>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedData.headline ?? userData.headline}
              onChange={(e) =>
                setEditedData({ ...editedData, headline: e.target.value })
              }
              className="text-gray-600 dark:text-gray-300 text-center w-full bg-transparent"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              {userData.headline}
            </p>
          )}

          <div className="flex justify-center items-center mt-2">
            <MapPin
              size={16}
              className="mr-1 text-gray-500 dark:text-gray-400"
            />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? userData.location}
                onChange={(e) =>
                  setEditedData({ ...editedData, location: e.target.value })
                }
                className="text-gray-600 dark:text-gray-300 text-center bg-transparent"
              />
            ) : (
              <span className="text-gray-600 dark:text-gray-300">
                {userData.location}
              </span>
            )}
          </div>
        </div>

        {isOwnProfile ? (
          isEditing ? (
            <button
              className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-[#004182]
							 transition duration-300"
              onClick={handleSave}
            >
              Save Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-[#004182]
							 transition duration-300"
            >
              Edit Profile
            </button>
          )
        ) : (
          <div className="flex justify-center">{renderConnectionButton()}</div>
        )}
      </div>
    </div>
  );
};
export default ProfileHeader;
