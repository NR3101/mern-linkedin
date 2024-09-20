import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Sun, Moon } from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const queryClient = useQueryClient();

  // Using useQuery to fetch the authenticated user info from the server via cached query
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser, // if authUser is not available, the query will not be executed
  });

  // fetch connection requests
  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser, // if authUser is not available, the query will not be executed
  });

  // logout mutation using react-query
  const { mutate: logout } = useMutation({
    mutationFn: async () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      // invalidate the authUser query to fetch the latest data so that we can redirect to login page
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  const unreadNotificationsCount = notifications?.data?.filter(
    (noti) => !noti.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data.length;

  return (
    <>
      <nav className="bg-secondary dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img
                  className="h-8 rounded"
                  src="/small-logo.png"
                  alt="LinkedIn"
                />
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-6">
              {authUser ? (
                <>
                  <Link
                    to={"/"}
                    className="text-neutral dark:text-gray-300 hover:text-primary dark:hover:text-[#004182]  flex flex-col items-center"
                  >
                    <Home size={20} />
                    <span className="text-xs hidden md:block">Home</span>
                  </Link>
                  <Link
                    to="/network"
                    className="text-neutral dark:text-gray-300 hover:text-primary dark:hover:text-[#004182]  flex flex-col items-center relative"
                  >
                    <Users size={20} />
                    <span className="text-xs hidden md:block">My Network</span>
                    {unreadConnectionRequestsCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                rounded-full size-3 md:size-4 flex items-center justify-center"
                      >
                        {unreadConnectionRequestsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/notifications"
                    className="text-neutral dark:text-gray-300 hover:text-primary dark:hover:text-[#004182]  flex flex-col items-center relative"
                  >
                    <Bell size={20} />
                    <span className="text-xs hidden md:block">
                      Notifications
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                rounded-full size-3 md:size-4 flex items-center justify-center"
                      >
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to={`/profile/${authUser.username}`}
                    className="text-neutral dark:text-gray-300 hover:text-primary dark:hover:text-[#004182]  flex flex-col items-center"
                  >
                    <User size={20} />
                    <span className="text-xs hidden md:block">Me</span>
                  </Link>

                  <button
                    className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-[#004182] "
                    onClick={() => logout()}
                  >
                    <LogOut size={20} />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost dark:text-gray-300 dark:hover:text-[#004182] "
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Join now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Floating theme toggle button */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-10 right-10 p-4 rounded-full bg-secondary dark:bg-gray-700 text-neutral dark:text-gray-300 hover:text-primary dark:hover:text-[#004182]  shadow-lg transition-all duration-300 
        ease-in-out z-50"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={28} /> : <Moon size={28} />}
      </button>
    </>
  );
};

export default Navbar;
