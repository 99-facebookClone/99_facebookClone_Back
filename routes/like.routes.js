const express = require('express');
const router = express.Router();
// const authMiddleware = require("../middlewares/auth-middleware");
const LikeController = require('../controllers/like.controller');

const likeController = new LikeController();
 
// 게시글에 좋아요 등록
router.post('/:post_id',likeController.createLike);
// 게시글 좋아요 여부 확인
// router.post('/:post_id',LikeController.chkLike);
// 게시글 좋아요 취소
// router.post('/:post_id',LikeController.deleteLike);




module.exports = router;
