import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../utils/cloudinary.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";

// Post Controllers

// Controller to get all posts in the user's feed with author's details and comments
export const getFeedPosts = async (req, res) => {
  try {
    // Find posts where the author is in the user's connections --> populate is a method in mongoose that allows you to reference documents in other collections
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id] },
    })
      .populate("author", "name profilePicture username headline") // Populate the author field with the name, profilePicture, username, and headline of the user
      .populate("comments.user", "name profilePicture ") // Populate the comments.user field with the name and profilePicture of the user
      .sort({ createdAt: -1 }); // Sort the posts by createdAt in descending order

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeedPosts: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to create a new post
export const createPost = async (req, res) => {
  try {
    // Get the content and image from the request body
    const { content, image } = req.body;

    // Check if the content is empty
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    let newPost;

    // If there is an image, upload it to Cloudinary and create a new post with the image
    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imgResult.secure_url,
      });
    }
    // If there is no image, create a new post without the image
    else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    // Save the new post to the database
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the request parameters
    const userId = req.user._id; // Get the user ID from the request

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    // If the post has an image, delete the image from Cloudinary
    if (post.image) {
      // Delete the image from Cloudinary by getting the public ID of the image from the URL
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to get a post by ID with author's details and comments
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the request parameters

    // Find the post by ID and populate the author and comments fields
    const post = await Post.findById(postId)
      .populate("author", "name profilePicture username headline") // Populate the author field with the name, profilePicture, username, and headline of the user
      .populate("comments.user", "name profilePicture username headline"); // Populate the comments.user field with the name and profilePicture of the user

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to create a comment on a post
export const createComment = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the request parameters
    const { content } = req.body; // Get the content of the comment from the request body

    // Check if the content is empty
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Find the post by ID and update the comments array
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            user: req.user._id,
            content,
          },
        },
      },
      {
        new: true, // Return the updated post
      }
    ).populate("author", "name profilePicture username headline email"); // Populate the author field with the name, profilePicture, username, and headline of the user

    // If the post is not found, return a 404 error
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // create a notification if the user is not the author of the post
    if (post.author._id.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await newNotification.save();

      //Send Email Notification
      try {
        const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;

        await sendCommentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          content
        );
      } catch (error) {
        console.error("Error in sending comment email notification: ", error);
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in createComment: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to like a post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the request parameters
    const userId = req.user._id; // Get the user ID from the request

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is liking or unliking the post
    if (post.likes.includes(userId)) {
      // If the user has already liked the post, unlike the post
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // If the user has not liked the post, like the post
      post.likes.push(userId);

      // create a notification if the user is not the author of the post
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });

        await newNotification.save();
      }
    }

    // Save the updated post to the database
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in likePost: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
