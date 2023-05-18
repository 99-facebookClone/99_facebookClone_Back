const { Op } = require("sequelize");

class LikeRepository {
  constructor(likesModel) {
    this.Likes = likesModel;
  }
  // 좋아요 등록
  createLike = async (post_id, user_id) => {
    const createLikeData = await this.Likes.create({
      post_id,
      user_id,
    });
    return createLikeData;
  };

  // 좋아요 확인
  findOneLike = async (post_id, user_id) => {
    const findOneLikeData = await this.Likes.findOne({
      where: { post_id, user_id },
    });
    return findOneLikeData;
  };

  // 좋아요 취소
  deleteLike = async (post_id, user_id) => {
    const deleteLikeData = await this.Likes.destroy({
      where: { post_id, user_id },
    });
    return deleteLikeData;
  };
  //강준석은 할 수 있다.
}
module.exports = LikeRepository;
