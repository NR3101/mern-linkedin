import { mailtrapClient, sender } from "../utils/mailtrap.js";
import {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

// Function to send a welcome email to the user
export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to UnLinked",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "Welcome Email",
    });

    console.log("Welcome email sent: ", res);
  } catch (error) {
    console.error("Error sending welcome email: ", error);
    throw error;
  }
};

// Function to send a comment notification email to the post author
export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const recipient = [{ email: recipientEmail }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${commenterName} commented on your post`,
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: "Comment Notification Email",
    });

    console.log("Comment notification email sent: ", res);
  } catch (error) {
    console.error("Error sending comment notification email: ", error);
    throw error;
  }
};

// Function to send a connection accepted email to the sender
export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  const recipient = [{ email: senderEmail }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
      category: "Connection Accepted Email",
    });

    console.log("Connection accepted email sent: ", res);
  } catch (error) {
    console.error("Error sending connection accepted email: ", error);
    throw error;
  }
};
