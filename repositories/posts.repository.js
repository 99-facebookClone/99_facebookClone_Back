const { Posts, Images, Users, Sequelize } = require("../models");

class PostRepository {
  // Posts Table에 content 저장
  createPost = async (user_id, content) => {
    const createPostData = await Posts.create({
      user_id,
      content,
    });

    return createPostData;
  };

  // Images Table에 img_url 저장
  createImage = async (post_id, img_url) => {
    const createImageData = await Images.create({
      post_id,
      img_url,
    });
    return createImageData;
  };

  // post_id를 이용해 해당 게시글에 저장된 모든 이미지 조회
  findAllImageByPostId = async (post_id) => {
    const findAllImageByPostIdData = await Images.findAll({
      where: { post_id },
      attributes: [
        "image_id",
        "post_id",
        "img_url",
        "createdAt",
        "updatedAt",
      ]
    });
    return findAllImageByPostIdData;
  };

  // 게시글 삭제
  deletePost = async (post_id) => {
    await Posts.destroy({ where: { post_id } });
    await Images.destroy({ where: { post_id } });
    return;
  };

  // 게시글 수정
  updatePost = async (post_id, content) => {
    const updatePost = await Posts.update(
      { content },
      { where: { post_id } },
    );
    return updatePost;
  };

  // 게시글 수정 - img_url 삭제
  deleteImage = async (url_id) => {
    await Images.destroy({where: {image_id: url_id}});
    return;
  };

  findOnePost = async (post_id) => {
    const findOnePostData = await Posts.findOne({
      where: { post_id },
      attributes: [
        "post_id",
        "user_id",
        "content",
        "likes",
        "createdAt",
        "updatedAt",
      ],
    });
    return findOnePostData;
  };

  findAllPost = async () => {
    const findAllPostsData = await Posts.findAll({
      include: [
        {
          model: Users,
          attributes: [],
          require: true,
        },
      ],
      attributes: [
        "post_id",
        "user_id",
        [Sequelize.literal("`User`.`name`"), "name"],
        [Sequelize.literal("`User`.`profile_url`"), "profile_url"],
        "content",
        "likes",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    return findAllPostsData;
  };

  findAllImg = async () => {
    const findAllImagesData = await Images.findAll({
      attributes: ["image_id", "post_id", "img_url", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });
    return findAllImagesData;
  };

  plusPostLike = async (post_id) => {
    await Posts.increment("likes", { where: { post_id: post_id } });
  };

  minusPostLike = async (post_id) => {
    await Posts.decrement("likes", { where: { post_id: post_id } });
  };
}

module.exports = PostRepository;
