const { Op } = require('sequelize');

class UserRepository {
  constructor(usersModel) {
    this.Users = usersModel;
  }
  createUser = async (email, name, password, birthday, gender, profile_url) => {
    const createUserData = await this.Users.create(
      email,
      name,
      password,
      birthday,
      gender,
      profile_url
    );
    return createUserData;
  };

  findOneUser = async (email) => {
    const findOneUserData = await this.Users.findOne({
      where: { email: email },
    });
    return findOneUserData;
  };

  findOneByUserId = async (user_id) => {
    const userInfo = await this.Users.findOne({
      where: { user_id },
    });
    return userInfo;
  };

  searchUser = async (name) => {
    const searchUserData = await this.Users.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      attributes: ['user_id', 'name', 'email', 'profile_url'],
    });
    return searchUserData;
  };

}

module.exports = UserRepository;
