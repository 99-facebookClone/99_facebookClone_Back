const PostRepository = require('../repositories/posts.repository');
const { sequelize } = require('../models');
const { Transaction } = require('sequelize');

class PostService {
  postRepository = new PostRepository();

  // 게시글 작성 - content만 등록 시
  createPost = async (
    user_id, content
  ) => {
    const createPostData = await this.postRepository.createPost(
      user_id,
      content,
    );

    return {
      post_id: createPostData.post_id,
      content: createPostData.content,
    };
  };

  // 게시글 작성 - content와 이미지 파일 함께 등록 시
  createPostImage = async (
    user_id,
    content,
    img_urls,
  ) => {
    // transaction 설정
    const result = await sequelize.transaction(
      // 격리 수준 설정 - 커밋된 읽기만 허용 (트랜잭션이 데이터를 수정하고 있는 중에는 데이터를 읽을 수 없다.)
      { isolateLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const createPostData = await this.postRepository.createPost(
          user_id,
          content,
          { transaction: t }
        );

        // 배열 형태의 img_url을 반복하면서 하나씩 posts.repository로 보냄
        const createImageDataPromises = img_urls.map(async (img_url) => {
          const createImageData = await this.postRepository.createImage(
            createPostData.post_id,
            img_url,
            { transaction: t }
          );
          return createImageData;
        });

        const createImageData = await Promise.all(createImageDataPromises);

        return {
          post_id: createPostData.post_id,
          content: createPostData.content,
          img_urls: createImageData.map((data) => data.img_url),
        };
      }
    );

    return result;
  };

  // 게시글 수정
  updatePost = async (post_id, content) => {
    const updatePost = await this.postRepository.updatePost(post_id, content);
    return updatePost;
  };

  // 게시글 수정 - 이미지 파일 추가 등록
  updateImage = async (post_id, img_urls) => {
    const createImageDataPromises = img_urls.map(async (img_url) => {
      const createImageData = await this.postRepository.createImage(
        post_id,
        img_url,
      );
      return createImageData;
    });

    const createImageData = await Promise.all(createImageDataPromises);

    return {
      post_id,
      img_urls: createImageData.map((data) => data.img_url),
    };
  };

  // 게시글 수정 - img_url 삭제
  deleteImage = async (removeImgIdArray) => {
    await removeImgIdArray.split(',').map( (url_id) => {
      this.postRepository.deleteImage(url_id);
    });
  };

  // 게시글 삭제
  deletePost = async (post_id) => {
    const deletePost = await this.postRepository.deletePost(post_id);
    return deletePost;
  };

  // post_id로 해당 게시물에 등록된 모든 이미지 조회
  findAllImageByPostId = async (post_id) => {
    const findAllImageByPostIdData = await this.postRepository.findAllImageByPostId(post_id);
    return findAllImageByPostIdData;
  };

  // post_id로 하나의 게시글만 조회
  findOnePost = async (post_id) => {
    const findOnePostData = await this.postRepository.findOnePost(post_id);
    return findOnePostData;
  };

  // 모든 게시글 조회
  findAllPost = async () => {
    const findAllPostData = await this.postRepository.findAllPost();
    return findAllPostData;
  };

  // 모든 img 조회
  findAllImg = async () => {
    const findAllImgData = await this.postRepository.findAllImg();
    return findAllImgData;
  };

  // 게시글 좋아요 +1
  async plusPostLike(post_id) {
    await this.postRepository.plusPostLike(post_id);
  }

  // 게시글 좋아요 -1
  async minusPostLike(post_id) {
    await this.postRepository.minusPostLike(post_id);
  }
}

module.exports = PostService;
