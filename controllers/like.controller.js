const Posts = require("../models/posts");
const LikeService = require("../services/like.service");
const PostService = require("../services/posts.service");

class LikeController {
  likeService = new LikeService();
  postService = new PostService();

  // 좋아요 등록
  createLike = async (req, res) => {
    try {
      // const { user_id } = res.locals.user;
      const user_id = 2;
      const { post_id } = req.params;
      // 아직 post service 함수를 안만듬
      const post = await this.postService.findOnePost(post_id);
      if (!post) {
        return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
      }
      // 좋아요가 있는지 없는지
      const createLikeData = await this.likeService.findOneLike(
        post_id,
        user_id
      );

      const postLikeIsZero = post.likes === 0;
      if (createLikeData) {
        // 이미 좋아요가 달려있으면 좋아요 취소
        await this.likeService.deleteLike(post_id, user_id);
        await this.postService.minusPostLike(post_id);
        res.status(200).json({ message: "좋아요를 취소하였습니다." });
      } else if (!createLikeData && postLikeIsZero) {
        // 좋아요 등록
        await this.likeService.createLike(post_id, user_id);
        await this.postService.plusPostLike(post_id);
        res.status(200).json({ message: "좋아요를 등록하였습니다." });
      } else {
        // 좋아요 등록 불가능 (좋아요 개수가 0개인 경우)
        res.status(402).json({ message: "다시 시도해주세요." });
      }
    } catch (error) {
      console.error(error); // 오류 메시지 출력

      return res.status(400).json({ message: "좋아요 등록에 실패하였습니다." });
    }
  };
}

module.exports = LikeController;
