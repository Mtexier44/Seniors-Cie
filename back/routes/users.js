const express = require("express");
const router = express.Router();

let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

// Route GET /api/users
router.get("/", (req, res) => {
  res.json(users);
});

module.exports = router;
