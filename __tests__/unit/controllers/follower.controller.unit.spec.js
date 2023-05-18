const FollowerController = require("../../../controllers/follower.controller");

//service계층에서 사용하는 메소드 가짜(mock) 함수 정의
let mockFollowersService = {
    getFollowerAll: jest.fn(),
    postFollower: jest.fn(),
    deleteFollower: jest.fn()
}

let mockRequest = {
    body: jest.fn(),
};

let mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

// let mockNext = jest.fn();

let followerController = new FollowerController();
followerController.followerService = mockFollowersService;


describe("팔로워 컨트롤러 계층 유닛 테스트", () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
    });

    test("팔로워 컨트롤러계층 postFollower 메소드 성공 테스트", async () => {
        const postFollowerRequestBody = {
            user_id: 1
        };

        mockRequest.body = postFollowerRequestBody;

        const postFollowerReturnValue = { "message": "팔로워 추가 완료" };


        //실행 =  { "message": "팔로워 추가 완료" };
        mockFollowersService.postFollower = jest.fn(() => postFollowerReturnValue);

        await followerController.postFollower(mockRequest, mockResponse);

        //req 
        expect(mockFollowersService.postFollower).toHaveBeenCalledTimes(1);
        expect(mockFollowersService.postFollower).toHaveBeenCalledWith(
            postFollowerRequestBody.user_id,
        );

        //res
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            "message": "팔로워 추가 완료"
        });
    });



    test("팔로워 컨트롤러계층 getFollwerAll 메소드 성공 테스트", async () => {
        const getFollwerAllReturnValue = {
            follow: [
                {
                    follow_id: 1,
                    user_id: 1,
                    follower_name: "kim_cool",
                    createdAt: "2022-07-25T07:45:56.000Z",
                    updatedAt: "2022-07-25T07:52:09.000Z",
                },
                {
                    follow_id: 2,
                    user_id: 1,
                    follower_name: "kim_cool",
                    createdAt: "2022-07-25T07:45:56.000Z",
                    updatedAt: "2022-07-25T07:52:09.000Z",
                },

            ]
        }

        const getFollwerAllRequestBody = {
            user_id: 1,
        };
        mockRequest.body = getFollwerAllRequestBody

        mockFollowersService.getFollowerAll = jest.fn(
            () => getFollwerAllReturnValue
        );

        await followerController.getFollowerAll(mockRequest, mockResponse);

        expect(mockFollowersService.getFollowerAll).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ follow: getFollwerAllReturnValue });
    });

    test("팔로워 컨트롤러계층 deleteFollower 메소드 성공 테스트", async () => {
        const deleteFollowerRequestBody = {
            user_id: 1
        };

        mockRequest.body = deleteFollowerRequestBody

        const deleteFollowerReturnValue = { "message": "팔로우 취소 완료" };

        mockFollowersService.deleteFollower = jest.fn(() => deleteFollowerReturnValue);


        await followerController.deleteFollower(mockRequest, mockResponse);

        expect(mockFollowersService.deleteFollower).toHaveBeenCalledTimes(1);
        expect(mockFollowersService.deleteFollower).toHaveBeenCalledWith(
            deleteFollowerRequestBody.user_id
        );

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            "message": "팔로우 취소 완료",
        });
    });

});