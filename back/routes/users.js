const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", UserController.getUsers);
router.get("/me", authMiddleware, UserController.getMe);
router.post("/", UserController.createUsers);
router.put("/me", authMiddleware, UserController.updateUsers);
router.delete("/:id", UserController.deleteUsers);

module.exports = router;
