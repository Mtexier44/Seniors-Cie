const express = require("express");
const router = express.Router();
const messageController = require("../controllers/MessageController");

router.post("/", messageController.createMessage);
router.get("/:userId", messageController.getMessages);
router.get("/:id", messageController.getMessageById);
router.put("/:id/seen", messageController.markAsSeen);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
