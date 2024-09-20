import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import UserCard from "../components/UserCard";

const NetworkPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  //query for connection requests
  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"),
  });

  //query for connections
  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-base-content dark:text-white">
            My Network
          </h1>

          {connectionRequests?.data?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-base-content dark:text-white">
                Connection Requests
              </h2>
              <div className="space-y-4">
                {connectionRequests?.data?.map((request) => (
                  <FriendRequest key={request._id} request={request} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 text-center mb-6">
              <UserPlus
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-300 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                No Connection Requests
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You don&apos;t have any pending connection requests at the
                moment.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Explore suggested connections below to expand your network!
              </p>
            </div>
          )}

          {connections?.data?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-base-content dark:text-white">
                My Connections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.data.map((connection) => (
                  <UserCard
                    key={connection._id}
                    user={connection}
                    isConnection={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
