const PostService = require('../services/posts.service');

class PostsController {
  postService = new PostService();

  // 게시물 작성
  createPost = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { content } = req.body;
      const img_urls = req.img_url;

      if (!content) {
        return res.status(412).json({ errorMessage: '게시글 내용을 입력해주세요.' });
      }

      // content만 입력할 경우
      if (img_urls === undefined) {
        const createPostData = await this.postService.createPost(
          user_id,
          content,
        );
        console.log(createPostData);
      };

      // 이미지 파일을 함께 업로드 할 경우
      if (img_urls !== undefined) {
        const createPostImageData = await this.postService.createPostImage(
          user_id,
          content,
          img_urls,
        );
        console.log(createPostImageData);
      }

      return res.status(200).json({ message: "게시물 작성에 성공했습니다." });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
    }
  };

  // 게시글 상세 조회
  getPostById = async (req, res) => {
    try {
      const { post_id } = req.params;
      const findOnePost = await this.postService.findOnePost(post_id);
      const findAllImageByPostId = await this.postService.findAllImageByPostId(post_id);

      return res.status(200).json({ post: findOnePost, image: findAllImageByPostId });
    } catch (err) {
      console.error(err);
      res.status(400).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
    };
  };

  // 게시글 수정
  updatePost = async (req, res) => {
    try {
      const { post_id } = req.params;
      const { content } = req.body;
      const { user_id } = res.locals.user;
      const removeImgIdArray = req.body.removeImgId; // 삭제할 이미지 url_id의 배열
      const img_urls = req.img_url; // 새로 추가된 이미지 파일

      // 이미지 파일 삭제
      if (removeImgIdArray.length > 0) {
        await this.postService.deleteImage(removeImgIdArray);
      };

      // 이미지 파일 추가 등록
      if (img_urls !== undefined) {
        const updateImageData = await this.postService.updateImage(
          post_id,
          img_urls,
          );
        console.log(updateImageData);
      };

      const findOnePost = await this.postService.findOnePost(post_id);

      if (!findOnePost) {
        return res.status(404).json({ errorMessage: '해당 게시물이 존재하지 않습니다.' });
      };

      if (user_id !== findOnePost.user_id) {
        return res.status(403).json({ errorMessage: '게시글 수정 권한이 없습니다.' });
      };

      if (!content) {
        return res.status(402).json({ errorMessage: '수정할 내용을 입력해 주십시오.' });
      };

      const updatePostData = await this.postService.updatePost(post_id, content);
      return res.status(200).json({
        message: "게시물 수정에 성공했습니다.",
        post: updatePostData,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ errorMessage: '게시글 수정에 실패하였습니다.' });
    };
  };

  // 게시글 삭제
  deletePost = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { post_id } = req.params;

      const findOnePost = await this.postService.findOnePost(post_id);

      if (!findOnePost) {
        return res.status(401).json({ errorMessage: '존재하지 않는 게시물입니다.' });
      }

      if (user_id !== findOnePost.user_id) {
        return res.status(400).json({ errorMessage: '게시글 삭제 권한이 없습니다.' });
      }

      await this.postService.deletePost(post_id);
      return res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
    };
  };

  // 피드, 게시글 전체 조회
  findAllPost = async (req, res) => {
    try {
      const findAllPost = await this.postService.findAllPost();
      const findAllImg = await this.postService.findAllImg();
      return res.status(200).json({ findAllPost, findAllImg });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  };
}

module.exports = PostsController;
