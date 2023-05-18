const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const { Tokens } = require('../models');
const TokenRepository = require('../repositories/tokens.repository');

module.exports = async (req, res, next) => {
  const tokenRepository = new TokenRepository(Tokens);

  let { Authorization, refreshtoken } = req.headers;
  //객체 형태로 가지고 올꺼야

  //1. header와 쿠키에서 access, refresh 추출
  try {
    Authorization = !req.headers.refreshtoken
      ? req.cookies.Authorization
      : Authorization;

    refreshtoken = !req.headers.refreshtoken
      ? req.cookies.refreshtoken
      : refreshtoken;
    console.log(req.cookies);

    //Authorization 은 Bearer형식으로 전달되어왔기 때문에 split으로 분리해준다.
    const [authType, accessToken] = (Authorization ?? '').split(' ');
    const isAccessTokenValidate = validateAccessToken(accessToken);
    const isRefreshTokenValidate = validateRefreshToken(refreshtoken);

    //2.refresh 유효성 검증값이 false일때, db에 refreshtoken 지워줌
    //(!isRefreshTokenValidate) means !true
    if (!isRefreshTokenValidate) {
      await tokenRepository.deleteRefreshToken2(refreshtoken);
      return res.status(419).json({
        message: 'Refresh Token이 만료되었습니다. 다시 로그인 해주세요',
      });
    }

    //access token의 유효성 검증값이 false일때 access를 다시 생성해야함
    if (!isAccessTokenValidate) {
      //서버가 발급한 refresh가 맞는지 확인 후 해당토큰에서 추출한 user_id가져와서 userId에 할당
      const userId = jwt.verify(refreshtoken, 'secret').user_id;
      //그 userId로 해당 사용자의 refreshtoken가져옴
      const userR = await tokenRepository.getRefreshToken(userId);

      if (!userR) {
        return res.status(419).json({
          message:
            'Refresh Token의 정보가 서버에 존재하지 않습니다. 다시 로그인 해주세요',
        });
      }

      //refresh 를 찾아와서 access 재발급
      const newAccessToken = createAccessToken(userR);
      res.cookie('Authorization', `Bearer ${newAccessToken}`);

      //새로운 access토큰의 userId를 사용하여 데이터 베이스에서 사용자 정보 가져온 후 넘겨준다
      const user = await Users.findOne({ where: { user_id: userId } });
      res.locals.user = user;
    }

    next();
  } catch (err) {
    console.log(err);
    res.clearCookie('Authorization');
    return res.status(403).send({
      errorMessage:
        '전달된 쿠키에서 오류가 발생하였습니다. 다시 로그인 해주세요',
    });
  }
};

function createAccessToken(user) {
  const accessToken = jwt.sign({ user_id: user.user_id }, 'secret', {
    expiresIn: '10s',
  });

  return accessToken;
}

//1. refresh, access Token의 유효성 검사(만료or위조 되었는지)
//jwt.verify를 통해서 진행한다.
function validateAccessToken(accessToken) {
  try {
    jwt.verify(accessToken, 'secret');
    return true;
  } catch (error) {
    return false;
  }
}

function validateRefreshToken(refreshToken) {
  try {
    jwt.verify(refreshToken, 'secret');
    return true;
  } catch (error) {
    return false;
  }
}

// } else {
//   const userId = jwt.verify(accessToken, 'secret');
//   const user = await Users.findOne({ where: { user_id: userId } });
//   res.locals.user = user;
// }
