import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader, X } from "lucide-react";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  // Create post mutation to create a new post
  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to create post");
    },
  });

  // Handle post creation on form submit
  const handlePostCreation = async () => {
    try {
      const postData = { content };

      if (image) postData.image = await readFileAsDataURL(image);

      createPostMutation(postData);
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  // function to reset the form
  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  // function to handle image change and set the image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  // function to read the file as data url when the user selects an image to upload
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Function to remove the image when the user clicks the X button
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-secondary dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt="profile"
          className="size-12 rounded-full"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-100 dark:bg-gray-700 hover:bg-base-200 dark:hover:bg-gray-600 focus:bg-base-200 dark:focus:bg-gray-600 focus:outline-none resize-none transition-colors duration-200 min-h-[100px] text-base-content dark:text-gray-100"
        />
      </div>

      {/* Image preview when the user selects an image to upload */}
      {imagePreview && (
        <div className="mt-4 relative">
          <img
            src={imagePreview}
            alt="image preview"
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white dark:bg-gray-200 dark:bg-opacity-50 dark:hover:bg-opacity-70 dark:text-gray-800 rounded-full p-1 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-info dark:text-gray-300 hover:text-info-dark dark:hover:text-gray-100 transition-colors duration-200 cursor-pointer">
            <Image className="mr-2" size={20} />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#004182] transition-colors duration-200"
          disabled={isPending}
          onClick={handlePostCreation}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};
export default PostCreation;
