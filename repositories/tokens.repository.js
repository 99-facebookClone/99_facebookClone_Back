const jwt = require('jsonwebtoken');
const { Tokens } = require('../models');

class TokenRepository {
  //refreshToken 이 있는지 확인, 없으면 생성 후 rToken 반환
  setRefreshToken = async (refreshToken, userId) => {
    // const existRefreshToken = await Tokens.findOne({
    //   where: { user_id: userId },
    //   attributes: ['user_id'],
    // });

    // if (!existRefreshToken) {
    const rToken = await Tokens.create({
      user_id: userId,
      token: refreshToken,
    });
    console.log(rToken);
    return rToken;
    // }
  };

  //refreshToken을 찾아서 반환
  getRefreshToken = async (userId) => {
    const token = await Tokens.findOne({
      where: { user_id: userId },
      attributes: ['user_id'],
    });
    return token;
  };

  // deleteRefreshToken = async (user_id) => {
  //   await Tokens.destroy({
  //     where: { user_id },
  //   });
  // };

  //db에 있는 refreshToken을 삭제
  deleteRefreshToken2 = async (refreshToken) => {
    await Tokens.destroy({
      where: { token: refreshToken },
    });
  };
}

module.exports = TokenRepository;
