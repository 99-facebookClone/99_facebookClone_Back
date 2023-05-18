const UserService = require('../services/users.service');
const moment = require('moment');

class UserController {
  userService = new UserService();

  signup = async (req, res) => {
    const { email, name, password, birthday, gender } = req.body;
    const img_url = req.img_url[0];

    try {
      if (!email) {
        return res.status(412).json({
          errorMessage: '이메일을 입력해 주십시오.',
        });
      }

      if (!name) {
        return res.status(412).json({
          errorMessage: '이름을 입력해 주십시오.',
        });
      }

      if (!password) {
        return res.status(412).json({
          errorMessage: '비밀번호를 입력해 주십시오.',
        });
      }

      if (!birthday) {
        return res.status(412).json({
          errorMessage: '생년월일을 입력해 주십시오.',
        });
      }

      if (!gender) {
        return res.status(412).json({
          errorMessage: '성별을 입력해 주십시오.',
        });
      }
      // 이메일 중복 필요하면 활성화
      const existsUser = await this.userService.findOneUser(email);

      if (existsUser) {
        return res.status(412).json({
          errorMessage: '중복된 이메일 입니다.',
        });
      }

      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(412).json({
          errorMessage:
            '비밀번호는 숫자, 영문, 특수기호를 조합한 여섯자리 이상이어야 합니다.',
        });
      }

      // const hashedPassword = await bcrypt.hash(password, 10);

      const signupData = await this.userService.signup({
        email,
        name,
        password,
        birthday,
        gender,
        profile_url: img_url,
      });
      console.log(birthday, typeof birthday);
      console.log(signupData);
      res.status(201).json({ message: '회원가입에 성공했습니다.', signupData });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
      });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const user = await this.userService.findOneUser(email);

    try {
      if (!user || password !== user.password) {
        res.status(412).json({
          errorMessage: '이메일 또는 패스워드를 확인해주세요.',
        });
        return;
      }

      //userData는 accessObject, refreshToken
      const userData = await this.userService.login(email);
      //회원네임과 사진을 반환해줘야함
      const loginData = await this.userService.findNameProfile(email);

      //Bearer, token 따로 따로 지정해줌
      res.cookie(
        'Authorization',
        `${userData.accessObject.type} ${userData.accessObject.token}`
      );

      res.cookie('refreshtoken', userData.refreshToken);
      res.status(200).json({
        message: '로그인에 성공하였습니다.',
        loginData,
        Authorization: `${userData.accessObject.type} ${userData.accessObject.token}`,
        refreshtoken: userData.refreshToken,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        errorMessage: '로그인에 실패하였습니다.',
      });
    }
  };

  searchUser = async (req, res, next) => {
    try {
      const { name } = req.params;
      const userInfos = await this.userService.searchUser(name);

      res.status(200).json(userInfos);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  };
}

module.exports = UserController;
