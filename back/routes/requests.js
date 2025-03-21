const express = require("express");
const router = express.Router();
const requestController = require("../controllers/RequestController");

router.post("/", requestController.createRequest);
router.get("/", requestController.getAllRequests);
router.get("/:id", requestController.getRequestById);
router.put("/:id", requestController.updateRequest);
router.delete("/:id", requestController.deleteRequest);

module.exports = router;
