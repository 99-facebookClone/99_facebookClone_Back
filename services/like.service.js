const LikeRepository = require("../repositories/like.repository");
const { Likes } = require("../models");

class LikeService {
  LikeRepository = new LikeRepository(Likes);

  // 좋아요 확인
  //LikeRepository에서 post_id와 user_id를 기준으로 좋아요 정보를 조회하는 역할
  findOneLike = async (post_id, user_id) => {
    const findOneLike = await this.LikeRepository.findOneLike(post_id, user_id);
    return findOneLike;
  };

  // 좋아요 등록 :)
  createLike = async (post_id, user_id) => {
    const createLike = await this.LikeRepository.createLike(post_id, user_id);
    return createLike;
  };

  // 좋아요 취소 :(
  deleteLike = async (post_id, user_id) => {
    const deleteLike = await this.LikeRepository.deleteLike(post_id, user_id);
    return deleteLike;
  };

  
}

module.exports = LikeService;
