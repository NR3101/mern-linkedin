import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData.experience || []);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });

  // function to handle the add experience
  const handleAddExperience = () => {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.startDate
    ) {
      setExperiences([...experiences, newExperience]);

      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
    }
  };

  // function to handle the delete experience
  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp._id !== id));
  };

  // function to handle the save experience
  const handleSave = () => {
    onSave({ experience: experiences });
    setIsEditing(false);
  };

  // function to handle the currently working checkbox
  const handleCurrentlyWorkingChange = (e) => {
    setNewExperience({
      ...newExperience,
      currentlyWorking: e.target.checked,
      endDate: e.target.checked ? "" : newExperience.endDate,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Experience
      </h2>

      {experiences.map((exp) => (
        <div key={exp._id} className="mb-4 flex justify-between items-start">
          <div className="flex items-start">
            <Briefcase
              size={20}
              className="mr-2 mt-1 text-gray-600 dark:text-gray-400"
            />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {exp.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{exp.company}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(exp.startDate)} -{" "}
                {exp.endDate ? formatDate(exp.endDate) : "Present"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {exp.description}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteExperience(exp._id)}
              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Title"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience({ ...newExperience, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-[#0073B1] focus:ring-1 focus:ring-primary dark:focus:ring-[#0073B1]"
          />
          <input
            type="text"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-[#0073B1] focus:ring-1 focus:ring-primary dark:focus:ring-[#0073B1]"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newExperience.startDate}
            onChange={(e) =>
              setNewExperience({ ...newExperience, startDate: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-[#0073B1] focus:ring-1 focus:ring-primary dark:focus:ring-[#0073B1]"
          />

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={newExperience.currentlyWorking}
              onChange={handleCurrentlyWorkingChange}
              className="mr-2 text-primary focus:ring-primary dark:focus:ring-[#0073B1]"
            />
            <label
              htmlFor="currentlyWorking"
              className="text-gray-700 dark:text-gray-300"
            >
              I currently work here
            </label>
          </div>

          {!newExperience.currentlyWorking && (
            <input
              type="date"
              placeholder="End Date"
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience({ ...newExperience, endDate: e.target.value })
              }
              className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-[#0073B1] focus:ring-1 focus:ring-primary dark:focus:ring-[#0073B1]"
            />
          )}

          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-[#0073B1] focus:ring-1 focus:ring-primary dark:focus:ring-[#0073B1]"
          />

          <button
            onClick={handleAddExperience}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-[#004182] dark:hover:bg-[#0073B1] transition duration-200"
          >
            Add Experience
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-[#004182] dark:hover:bg-[#0073B1] transition duration-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-primary hover:text-[#004182] dark:text-[#0073B1] dark:hover:text-[#004182]  transition duration-300"
            >
              Edit Experiences
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ExperienceSection;
