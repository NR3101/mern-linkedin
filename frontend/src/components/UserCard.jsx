import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md dark:hover:shadow-gray-900">
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="font-semibold text-lg text-center text-gray-900 dark:text-white">
          {user.name}
        </h3>
      </Link>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {user.headline}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {user.connections?.length} connections
      </p>
      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-[#004182] dark:hover:bg-[#0073B1] transition-colors w-full">
        {isConnection ? "Connected" : "Connect"}
      </button>
    </div>
  );
}

export default UserCard;
