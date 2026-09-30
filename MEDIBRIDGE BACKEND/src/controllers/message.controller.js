const messageService = require("../services/message.service");


/**
 * Sends a message.
 */
const sendMessage = async (req, res) => {
  try {
    const message =
      await messageService.sendMessage(
        req.user.id,
        req.params.consultationId,
        req.body.body
      );

    return res.status(201).json({
      message: "Message sent successfully.",
      data: {
        message,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(400).json({
      message:
        error.message ||
        "Unable to send message.",
    });
  }
};


/**
 * Gets messages for a consultation.
 */
const getMessages = async (req, res) => {
  try {
    const messages =
      await messageService.getMessages(
        req.user.id,
        req.params.consultationId
      );

    return res.status(200).json({
      message: "Messages retrieved successfully.",
      data: {
        messages,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(403).json({
      message:
        error.message ||
        "Unable to retrieve messages.",
    });
  }
};


module.exports = {
  sendMessage,
  getMessages,
};