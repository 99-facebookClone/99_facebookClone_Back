const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller');
const uploadImage = require('../middlewares/multer-s3');
const postsController = new PostsController();
const authMiddleware = require("../middlewares/auth-middleware");

router.post('/', authMiddleware, uploadImage.array('img', 4), postsController.createPost); // 게시물 작성
router.get("/:post_id", postsController.getPostById); // 게시물 상세조회
router.put("/:post_id", authMiddleware, uploadImage.array('img', 4), postsController.updatePost); // 게시물 수정
router.delete("/:post_id", authMiddleware, postsController.deletePost); // 게시물 삭제

router.get('/', postsController.findAllPost);

module.exports = router;
