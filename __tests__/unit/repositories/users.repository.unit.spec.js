const UserRepository = require('../../../repositories/users.repository');

// users.repository.js 에서는 아래 5개의 Method만을 사용합니다.
let mockUsersModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

let userRepository = new UserRepository(mockUsersModel);

describe('Layered Architecture Pattern User Repository Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('회원가입/로그인 계층 SearchUser: findAll Method 테스트', async () => {
    mockUsersModel.findAll = jest.fn(() => {
      return 'findAll Result';
    });

    const users = await userRepository.searchUser();
    expect(mockUsersModel.findAll).toHaveBeenCalledTimes(1);
    expect(users).toEqual('findAll Result');
  });

  test('회원가입/로그인 계층 SearchUser: findOne Method 테스트', async () => {
    mockUsersModel.findOne = jest.fn(() => {
      return 'findOne Result';
    });

    const email = 'test@gmail.com';
    const users = await userRepository.findOneUser(email);
    expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockUsersModel.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(users).toEqual('findOne Result');
  });

  test('회원가입/로그인 계층 CreateUser: create Method 테스트', async () => {
    mockUsersModel.create = jest.fn(() => {
      return '회원가입 정보 정상 입력';
    });
    const createUsersParams = {
      email: 'createUserEmail',
      name: 'createUserName',
      password: 'createUserPassword',
      birthday: 'createUserBirthday',
      gender: 'createUserGender',
      profile_url: 'createUserProfile',
    };
    const createUserData = await userRepository.createUser(
      createUsersParams.email,
      createUsersParams.name,
      createUsersParams.password,
      createUsersParams.birthday,
      createUsersParams.gender,
      createUsersParams.profile_url
    );

    expect(mockUsersModel.create).toHaveBeenCalledTimes(1);
    expect(createUserData).toEqual('회원가입 정보 정상 입력');
    expect(mockUsersModel.create).toHaveBeenCalledWith(
      createUsersParams.email,
      createUsersParams.name,
      createUsersParams.password,
      createUsersParams.birthday,
      createUsersParams.gender,
      createUsersParams.profile_url
    );
  });
});
