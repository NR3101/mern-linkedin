import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const PostPage = () => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => axiosInstance.get(`/posts/${postId}`),
  });

  if (isPostLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-12 text-primary dark:text-primary" />
      </div>
    );

  if (!post?.data)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Post not found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The post you are looking for does not exist or has been deleted.
          </p>
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <Post post={post.data} />
      </div>
    </div>
  );
};

export default PostPage;
