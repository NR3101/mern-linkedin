import { X } from "lucide-react";
import { useState } from "react";

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // function to handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  // function to handle deleting a skill
  const handleDeleteSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // function to handle saving the skills
  const handleSave = () => {
    onSave({ skills: skills });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 ">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Skills
      </h2>
      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => handleDeleteSkill(skill)}
                className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X size={14} />
              </button>
            )}
          </span>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-grow p-2 border rounded-l bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-[#0073B1] focus:ring-1 focus:ring-primary dark:focus:ring-[#0073B1]"
          />
          <button
            onClick={handleAddSkill}
            className="bg-primary text-white py-2 px-4 rounded-r hover:bg-[#004182] dark:hover:bg-[#0073B1] transition duration-300"
          >
            Add Skill
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
              className="mt-4 text-primary hover:text-[#004182] dark:text-[#0073B1] dark:hover:text-[#004182] transition duration-300"
            >
              Edit Skills
            </button>
          )}
        </>
      )}
    </div>
  );
};
export default SkillsSection;
