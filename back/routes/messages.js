const express = require("express");
const router = express.Router();
const messageController = require("../controllers/MessageController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", messageController.createMessage);
router.get("/conversation/:receiverId", messageController.getMessages);
router.get("/single/:id", messageController.getMessageById);
router.put("/:id/seen", messageController.markAsSeen);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
