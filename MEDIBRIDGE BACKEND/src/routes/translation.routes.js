const express = require("express");

const translationController = require(
  "../controllers/translation.controller"
);

const authenticate = require(
  "../middleware/authenticate"
);

const router = express.Router();

/*
 * Translate a message.
 *
 * POST /api/translation
 */
router.post(
  "/",
  authenticate,
  translationController.translateMessage
);

module.exports = router;