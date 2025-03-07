const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/", UserController.getUsers);
router.post("/", UserController.createUsers);
router.put("/:id", UserController.updateUsers);
router.delete("/:id", UserController.deleteUsers);

module.exports = router;
