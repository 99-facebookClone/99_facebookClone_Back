const LikeController = require("../../../controllers/like.controller");
const LikeService = require("../../../services/like.service");
const PostService = require("../../../services/posts.service");

// Jest의 mock기능으로 가짜(mock) LikeService, PostService 모듈 생성
jest.mock("../../../services/like.service");
jest.mock("../../../services/posts.service");

// LikeController.js의 유닛 테스트, describe 함수를 사용하여 테스트를 생성
describe("LikeController 유닛 테스트", () => {
  let likeController; // like.controller의 인스턴스를 의미
  let likeService;    // like.service의 인스턴스를 의미
  let postService;    // post.service의 인스턴스를 의미

  // 각 테스트 케이스가 실행되기 전에 실행되는 코드
  beforeEach(() => {
    likeService = new LikeService();       // 위에서 likeService 인스턴스를 초기화하여 새로운 LikeService 생성
    postService = new PostService();       // why? 각 테스트에 독립된 LikeController를 사용하기 위해
    likeController = new LikeController(); 
    likeController.postService = postService;// 각 테스트 케이스에서 likeController를 사용하여 likeService와 postService에 접근할 수 있다.
                                             // 각 서비스의 메서드를 모의(mock)하고 테스트에서 예상된 동작을 검증할 수 있다.
  });

  // ============================================= 좋아요 등록,취소 테이스케이스 시작 =============================================

  describe("createLike", () => {
    it("like.controller 테스트", async () => {
      const req = { params: { post_id: 1 } }; // post_id를 1로 테스트 한정 임의 지정
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // res는 status, json메서드를 가지는 객체, status는 자기 자신을 반환하도록 모의(mock)

      // postService.findOnePost 메서드가 null을 반환하도록 가정(mock)
      postService.findOnePost.mockResolvedValue(null); 
      // likeController.createLike 메서드가 호출되고,
      await likeController.createLike(req, res);
      // postService.findOnePost를 호출하여 post_id가 1인 피드 찾는다
      expect(postService.findOnePost).toHaveBeenCalledWith(1);
      // 게시글이 존재하지 않는 경우 status 404 반환
      expect(res.status).toHaveBeenCalledWith(404);
      // 반환된 JSON 객체에는 "해당 피드가 존재하지 않습니다."라는 메시지가 포함된다.
      expect(res.json).toHaveBeenCalledWith({
        message: "해당 피드가 존재하지 않습니다.",
      });
    });

    // ============================================= "좋아요"가 존재했을 때 좋아요를 취소하는 모의 테스트 =============================================

    it("피드에 좋아요가 이미 등록 되어있으면 좋아요 취소 200", async () => {
      const req = { params: { post_id: 1 } };       // req.params에서 요청받은 post_id를 1로 가정(mock)
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // res는 status, json메서드를 가지는 객체, status는 자기 자신을 반환하도록 모의(mock)
      const likeData = { post_id: 1, user_id: 2 };  // likeData 변수는 post_id = 1, user_id = 2 인 데이터로 가정(mock)

      // 좋아요누를 피드가 있고, "좋아요가 이미 등록되어있다 즉, 피드에 좋아요가 이미 등록되어있으면 좋아요 취소" 상황의 모의테스트
      postService.findOnePost.mockResolvedValue(likeData);  // 1번 피드(likeData)에 대한 좋아요 데이터를 조회한 결과를 반환하도록 모의(mock) 즉, 모의테스트용 피드가 있는지 찾음
      likeService.findOneLike.mockResolvedValue(likeData);  // 1번 피드(likeData)에 대한 좋아요 데이터를 조회한 결과를 반환하도록 모의(mock) 즉, 모의테스트용 좋아요데이터가 있는지 찾음

      await likeController.createLike(req, res);  // req,res객체를 인자로 받아 likeController의 createLike메서드를 호출

      expect(postService.findOnePost).toHaveBeenCalledWith(1);    // postService.findOnePost가 1과 함께 호출되었는지 확인
      expect(likeService.findOneLike).toHaveBeenCalledWith(1, 2); // likeService.findOneLike가 1과 2와 함께 호출되었는지 확인
      expect(likeService.deleteLike).toHaveBeenCalledWith(1, 2);  //likeService.deleteLike가 1과 2와 함께 호출되었는지 확인
      expect(postService.minusPostLike).toHaveBeenCalledWith(1);  //postService.minusPostLike가 1과 함께 호출되었는지 확인
      expect(res.status).toHaveBeenCalledWith(200); //res.status가 200와 함께 호출되었는지 확인
      expect(res.json).toHaveBeenCalledWith({ // res.json이 message: "좋아요를 취소하였습니다."와 함께 호출되었는지 확인
        message: "좋아요를 취소하였습니다.",
      });
    });
  
    // ============================================= "좋아요"가 존재하지 않을 때 좋아요를 추가하는 모의 테스트 =============================================

    it("피드에 좋아요가 존재하지 않을 때 좋아요 등록 200", async () => {
      const req = { params: { post_id: 1 } }; // req = post_id = 1 로 가정
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // res는 status, json메서드를 가지는 객체, status는 자기 자신을 반환하도록 모의(mock)
      const likeData = { post_id: 1, user_id: 2 };  // likeData 변수는 post_id = 1, user_id = 2 인 데이터로 가정(mock)

      postService.findOnePost.mockResolvedValue(likeData);  // 1번 피드(likeData)에 대한 좋아요 데이터를 조회한 결과를 반환하도록 모의(mock) 즉, 모의테스트용 피드가 있는지 찾음
      likeService.findOneLike.mockResolvedValue(null);  // findOneLike 메서드가 실행되면 "null"을 반환하도록 모의 즉, "좋아요"가 존재하지않는다.

      await likeController.createLike(req, res);  //likeController의 createLike메서드 실행 즉, "좋아요"를 등록한다.

      expect(postService.findOnePost).toHaveBeenCalledWith(1);    // postService.findOnePost가 1과 함께 호출되었는지 확인
      expect(likeService.findOneLike).toHaveBeenCalledWith(1, 2); // likeService.findOneLike가 1과 2와 함께 호출되었는지 확인
      expect(likeService.deleteLike).toHaveBeenCalledWith(1, 2);  //likeService.deleteLike가 1과 2와 함께 호출되었는지 확인
      expect(postService.plusPostLike).toHaveBeenCalledWith(1);  //postService.plusPostLike가 1과 함께 호출되었는지 확인
      expect(res.status).toHaveBeenCalledWith(200); //res.status가 200와 함께 호출되었는지 확인
      expect(res.json).toHaveBeenCalledWith({ // res.json이 message: "좋아요를 등록하였습니다."와 함께 호출되었는지 확인
        message: "좋아요를 등록하였습니다.",
      });
    });

    // ============================================= "좋아요"등록 중에 오류가 발생했을 때 오류처리가 잘 되는지 모의" =============================================

    it("피드에 좋아요 등록 중 오류가 발생했습니다 400", async () => {
      const req = { params: { post_id: 1 } }; // req객체는 params로 전달받은 post_id:1로 모의
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };  // res객체는 status,json객체를 가진다, status는 자기 자신을 반환 한다

      postService.findOnePost.mockRejectedValue(new Error()); // postService의 findOnePost 메서드가 호출되면 오류를 발생시키도록 모의한다. 
                                                              // 즉, "좋아요" 등록 중에 오류가 발생한다고 상황을 만든다.
      await likeController.createLike(req, res);              // likeController의 createLike 메서드를 호출 즉,"좋아요" 등록

      expect(postService.findOnePost).toHaveBeenCalledWith(1);// postService.findOnePost가 1과 함께 호출되었는지 확인
      expect(res.status).                                     // res.status가 400과 함께 호출되었는지 확인
      expect(res.status).toHaveBeenCalledWith(400);           // res.json이 오류 메시지와 함께 호출되었는지 확인
      expect(res.json).toHaveBeenCalledWith({
        message: "좋아요 등록에 실패하였습니다.",
      });
    });
  });
});
