import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import PostAction from "./PostAction";

const Post = ({ post }) => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const isOwner = authUser?._id === post.author._id;
  const isLiked = post.likes.includes(authUser?._id);

  // mutation to delete the post
  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully", {
        id: "delete-post-success",
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong", {
        id: "delete-post-error",
      });
    },
  });

  // mutation to create a comment
  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment created successfully", {
        id: "create-comment-success",
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong", {
        id: "create-comment-error",
      });
    },
  });

  // mutation to like a post
  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  // function to delete the post
  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  // function to like the post
  const handleLikePost = async () => {
    if (isLikingPost) return; //if we are already liking the post return
    likePost();
  };

  // function to add a comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");

      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  // function to share the post
  const handleSharePost = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast.success("Post link copied to clipboard", {
          id: "share-post-success",
        });
      })
      .catch(() => {
        toast.error("Failed to copy link", {
          id: "share-post-error",
        });
      });
  };

  return (
    <div className="bg-secondary dark:bg-gray-800 rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post?.author.profilePicture || "/avatar.png"}
                alt={post?.author.username}
                className="size-10 rounded-full mr-3"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold text-base-content dark:text-white">
                  {post.author.name}
                </h3>
              </Link>

              <p className="text-xs text-info dark:text-gray-300">
                {post.author.headline}
              </p>

              <p className="text-xs text-info dark:text-gray-300">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              disabled={isDeletingPost}
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>

        <p className="mb-4 text-base-content dark:text-gray-200">
          {post.content}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt={post.content || "post image"}
            className="w-full rounded-lg mb-4"
          />
        )}

        {/* Post Actions */}

        <div className="flex justify-between text-info dark:text-gray-400">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500 fill-blue-300" : ""}
              />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />

          <PostAction
            icon={<Share2 size={18} />}
            text="Share"
            onClick={handleSharePost}
          />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 dark:bg-gray-700 p-2 rounded flex items-start"
              >
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />

                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2 text-base-content dark:text-white">
                      {comment.user.name}
                    </span>

                    <span className="text-xs text-info dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>

                  <p className="text-base-content dark:text-gray-200">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-l-full bg-base-100 dark:bg-gray-700 text-base-content dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-full hover:bg-[#004182] transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Post;
