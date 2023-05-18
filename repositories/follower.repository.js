const { Users, Sequelize } = require("../models");
const { Op } = require("sequelize");

class FollowerRepository {
  constructor(Follows) {
    this.Follows = Follows;
    this.Users = Users;
  }

  getFollowerAll = async (user_id) => {
    const followList = await this.Follows.findAll({
      where: { user_id },
    });
    const followUserIds = followList.map((e) => e.follower_user_id);
    const userInfos = await this.Users.findAll({
      where: {
        user_id: {
          [Op.in]: followUserIds,
        },
      },
    });
    return [followList, userInfos]
  }

  findFollower = async (user_id, follower_user_id) => {
    const postFollowData = await this.Follows.findOne({
      where: {
        user_id: user_id,
        follower_user_id: follower_user_id,
      },
    });
    return postFollowData;
  };

  postFollower = async (user_id, follower_user_id) => {
    const postFollowData = await this.Follows.create({
      user_id: user_id,
      follower_user_id: follower_user_id,
    });
    return postFollowData;
  };

  deleteFollower = async (user_id, follower_user_id) => {
    const deleteFollowData = await this.Follows.destroy({
      where: { user_id: user_id, follower_user_id: follower_user_id },
    });

    return deleteFollowData;
  };
}

module.exports = FollowerRepository;
