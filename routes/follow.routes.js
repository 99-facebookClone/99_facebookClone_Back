const express = require("express");
const router = express.Router();
const FollowerController = require("../controllers/follower.controller");
const followerController = new FollowerController()
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/", authMiddleware, followerController.getFollowerAll);
router.post("/", authMiddleware, followerController.postFollower);
router.delete("/:follower_user_id", authMiddleware, followerController.deleteFollower);

module.exports = router;
