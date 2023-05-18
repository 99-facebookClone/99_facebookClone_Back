const UserService = require('../../../services/users.service.js');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');

let mockUsersRepository = {
  signup: jest.fn(),
  login: jest.fn(),
  findOneUser: jest.fn(),
  findNameProfile: jest.fn(),
  searchUser: jest.fn(), //오류 해결중
  createUser: jest.fn(),
};

let mockTokenRepository = {
  setRefreshToken: jest.fn(),
};

let userService = new UserService();
// userService의 Repository를 Mock Repository로 변경합니다.
userService.userRepository = mockUsersRepository;
userService.tokenRepository = mockTokenRepository;

describe('Layered Architecture Pattern User Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('Signup 테스트', async () => {
    const email = 'test@gmail.com';
    const name = 'test user';
    const password = 'password123';
    const birthday = '1990-01-01';
    const gender = 'male';
    const profile_url = 'https://example.com/profile';
    const createdAt = new Date('12 October 2022 00:00');
    const updatedAt = new Date('12 October 2022 00:00');

    const user = {
      user_id: 1,
      email,
      name,
      password,
      birthday,
      gender,
      profile_url,
      createdAt,
      updatedAt,
    };

    //실제로 테스트할 함수를 실행시켰을 때 결과값을 구하기
    mockUsersRepository.createUser.mockResolvedValue(user);
    const result = await userService.signup(
      email,
      name,
      password,
      birthday,
      gender,
      profile_url
    );

    //나와야하는 값
    const expectedUserInfo = {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      password: user.password,
      birthday: user.birthday,
      gender: user.gender,
      profile_url: user.profile_url,
      // createdAt: new Date('12 October 2022 00:00'),
      // updatedAt: new Date('12 October 2022 00:00'),
    };

    // console.log(result);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(
      email,
      name,
      password,
      birthday,
      gender,
      profile_url
    );
    expect(result).toEqual(expectedUserInfo);
  });

  test('login 테스트', async () => {
    //email로 user를 찾아서 user.user_id에 token이 잘 할당되는지
    //할당된 토큰이 잘 반환되는지 확인해야함
    //email주소와 user_id를 임의로 지정한 후 user 객체를 만들어서 실험하자
    const email = 'test@gmail.com';

    const user = {
      user_id: 1,
      email,
    };

    //실제 토큰 값 대신 문자열로 확인할 예정
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';

    //우선 mock함수로 user를 불러온다
    mockUsersRepository.findOneUser.mockResolvedValue(user);
    //mockFn.mockImplementation(()=>{목 함수가 호출될 때 실행될 코드})
    //원하는 만료 시간을 가진 가짜 토큰을 반환하기 위한 함수
    jwt.sign.mockImplementation((payload, secret, options) => {
      //payload: {user_id:1}
      //secret: 'secret'
      //options: 토큰 옵션을 나타내는 객체
      if (options.expiresIn === '10s') {
        return accessToken;
      } else if (options.expiresIn === '7d') {
        return refreshToken;
      }
    });
    //생성된 refresh는 db에 저장하는 부분
    //함수가 refreshToken이라는 인자와 함께 1번 호출되는지 실험
    mockTokenRepository.setRefreshToken.mockResolvedValue();

    const expectedAccessObject = {
      type: 'Bearer',
      token: accessToken,
    };

    const expectedResponse = {
      accessObject: expectedAccessObject,
      refreshToken,
    };

    const result = await userService.login(email);

    console.log(result, expectedResponse);
    expect(mockUsersRepository.findOneUser).toHaveBeenCalledWith(email);
    expect(jwt.sign).toHaveBeenCalledWith({ user_id: 1 }, 'secret', {
      expiresIn: '10s',
    });
    expect(jwt.sign).toHaveBeenCalledWith({ user_id: 1 }, 'secret', {
      expiresIn: '7d',
    });
    expect(mockTokenRepository.setRefreshToken).toHaveBeenCalledWith(
      refreshToken,
      1
    );

    expect(result).toEqual(expectedResponse);
  });

  test('findOne 테스트', async () => {
    const email = 'test@gmail.com';
    const findOneValue = {
      user_id: 1,
      name: 'name',
      email: 'test@gmail.com',
      password: '1234',
      birthday: '1990-07-081,',
      gender: 'female',
      profile_url: 'https://example.com/profile',
      createdAt: new Date('12 October 2022 00:00'),
      updatedAt: new Date('12 October 2022 00:00'),
    };

    mockUsersRepository.findOneUser.mockResolvedValue(findOneValue);
    const result = await userService.findOneUser(email);
    expect(mockUsersRepository.findOneUser).toHaveBeenCalledWith(email);
    expect(result).toEqual(findOneValue);
  });

  test('findNameProfile 테스트', async () => {
    const email = 'test@gmail.com';
    const findNameProfileValue = {
      name: 'name',
      profile_url: 'https://example.com/profile',
    };

    mockUsersRepository.findOneUser.mockResolvedValue(findNameProfileValue);
    const result = await userService.findNameProfile(email);
    expect(mockUsersRepository.findOneUser).toHaveBeenCalledWith(email);
    expect(result).toEqual(findNameProfileValue);
  });

  // test('searchUser 테스트', async () => {
  //   const name = '김철수';
  //   const findUserInfoValue = [
  //     {
  //       user_id: 1,
  //       name: '김철수',
  //       email: 'test@gmail.com',
  //       profile_url: 'https://example.com/profile',
  //     },
  //   ];

  //   mockUsersRepository.searchUser.mockResolvedValue(findUserInfoValue);
  //   const result = await userService.searchUser(name);
  //   expect(mockUsersRepository.searchUser).toHaveBeenCalledWith(name);
  //   expect(result).toEqual(findUserInfoValue);
  // });
});
