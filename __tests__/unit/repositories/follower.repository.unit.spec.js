const FollowerService = require('../../../services/follower.service');

//service계층에서 사용하는 메소드 가짜(mock) 함수 정의
let mockFollowersRepository = {
  getFollowerAll: jest.fn(),
  postFollower: jest.fn(),
  deleteFollower: jest.fn(),
};

let mockRequest = {
  body: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

let followersService = new FollowerService();
followersService.followersRepository = mockFollowersRepository;

describe('팔로워  서비스계층 유닛 테스트', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test('팔로워 서비스계층 postFollower 메소드 성공 테스트', async () => {
    const postFollowerReturnValue = { message: '팔로워 추가 완료' };

    const postFollowerBody = {
      user_id: 1,
    };

    mockFollowersRepository.postFollower = jest.fn(() => {
      return postFollowerReturnValue;
    });

    const postFollowData = await mockFollowersRepository.postFollower(
      postFollowerBody.user_id
    );

    expect(postFollowData).toEqual({ message: '팔로워 추가 완료' });
    expect(mockFollowersRepository.postFollower).toHaveBeenCalledTimes(1);
  });

  test('팔로워 서비스계층 getFollwerAll 메소드 성공 테스트', async () => {
    const getFollowerAllReturnValue = {
      follow: [
        {
          follow_id: 1,
          user_id: 1,
          follower_name: '김용식',
          profile_url: '123',
          createdAt: '11',
          updatedAt: '11',
        },
      ],
    };

    const getFollowerBody = {
      user_id: 1,
    };

    mockFollowersRepository.getFollowerAll = jest.fn(() => {
      return getFollowerAllReturnValue;
    });

    const getFollowAllData = await mockFollowersRepository.getFollowerAll(
      getFollowerBody.user_id
    );

    expect(getFollowAllData).toEqual({
      follow: [
        {
          follow_id: 1,
          user_id: 1,
          follower_name: '김용식',
          profile_url: '123',
          createdAt: '11',
          updatedAt: '11',
        },
      ],
    });
    expect(mockFollowersRepository.getFollowerAll).toHaveBeenCalledTimes(1);
  });

  test('팔로워 서비스계층 deleteFollower 메소드 성공 테스트', async () => {
    const deleteFollowerReturnValue = { message: '팔로워 취소 완료' };

    const deleteFollowerBody = {
      user_id: 1,
    };

    mockFollowersRepository.deleteFollower = jest.fn(() => {
      return deleteFollowerReturnValue;
    });

    const deleteFollowData = await mockFollowersRepository.deleteFollower(
      deleteFollowerBody.user_id
    );

    expect(deleteFollowData).toEqual({ message: '팔로워 취소 완료' });
    expect(mockFollowersRepository.deleteFollower).toHaveBeenCalledTimes(1);
  });
});
