const express = require("express");

const messageController = require(
  "../controllers/message.controller"
);

const authenticate = require(
  "../middleware/authenticate"
);

const router = express.Router();


/*
 * Send a message
 *
 * POST /api/consultations/:consultationId/messages
 */
router.post(
  "/:consultationId/messages",
  authenticate,
  messageController.sendMessage
);


/*
 * Get messages
 *
 * GET /api/consultations/:consultationId/messages
 */
router.get(
  "/:consultationId/messages",
  authenticate,
  messageController.getMessages
);


module.exports = router;