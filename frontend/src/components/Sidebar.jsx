import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
  return (
    <div className="bg-secondary dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
          }}
        />
        <Link to={`/profile/${user.username}`}>
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px]"
          />
          <h2 className="text-xl font-semibold mt-2 text-base-content dark:text-white">
            {user.name}
          </h2>
        </Link>
        <p className="text-info dark:text-gray-300">{user.headline}</p>
        <p className="text-info dark:text-gray-300 text-xs">
          {user.connections.length} connections
        </p>
      </div>
      <div className="border-t border-base-100 dark:border-gray-700 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors dark:text-gray-300 dark:hover:bg-primary"
              >
                <Home className="mr-2" size={20} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/network"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors dark:text-gray-300 dark:hover:bg-primary"
              >
                <UserPlus className="mr-2" size={20} /> My Network
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors dark:text-gray-300 dark:hover:bg-primary"
              >
                <Bell className="mr-2" size={20} /> Notifications
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-base-100 dark:border-gray-700 p-4">
        <Link
          to={`/profile/${user.username}`}
          className="text-sm font-semibold text-base-content dark:text-gray-300 hover:text-primary dark:hover:text-[#004182] "
        >
          Visit your profile
        </Link>
      </div>
    </div>
  );
}
