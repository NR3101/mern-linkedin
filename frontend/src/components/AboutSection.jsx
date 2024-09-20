import { useState } from "react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData.about || "");

  const handleSave = () => {
    setIsEditing(false);
    onSave({ about });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        About
      </h2>
      {isOwnProfile && (
        <>
          {isEditing ? (
            <>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-[#0073B1] focus:ring-1 focus:ring-primary dark:focus:ring-[#0073B1]"
                rows="4"
              />
              <button
                onClick={handleSave}
                className="mt-2 bg-primary text-white py-2 px-4 rounded hover:bg-[#004182] dark:hover:bg-[#0073B1] transition duration-300"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                {userData.about}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-primary hover:text-[#004182] dark:text-[#0073B1] dark:hover:text-[#004182]  transition duration-300"
              >
                Edit
              </button>
            </>
          )}
        </>
      )}
      {!isOwnProfile && (
        <p className="text-gray-700 dark:text-gray-300">{userData.about}</p>
      )}
    </div>
  );
};

export default AboutSection;
