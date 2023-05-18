const { Users, Follows } = require("../models");
const FollowerRepository = require("../repositories/follower.repository");
const UserRepository = require("../repositories/users.repository");

class FollowerService {
    followerRepository = new FollowerRepository(Follows);
    userRepository = new UserRepository(Users);

    getFollowerAll = async (user_id) => {

        const getUserData = await this.followerRepository.getFollowerAll(user_id)
        const a = getUserData[0].map((e) => {
            return {
                follow_id: e.dataValues.follow_id,
                createdAt: e.dataValues.createdAt,
                updatedAt: e.dataValues.updatedAt
            }
        })

        const b = getUserData[1].map((e) => {
            return {
                user_id: e.dataValues.user_id,
                follower_name: e.dataValues.name,
                profile_url: e.dataValues.profile_url
            }

        })

        let jujimin = [];
        for (let i = 0; i < a.length; i++) {
            let c = { ...a[i], ...b[i] };
            jujimin.push(c);
        }
        return jujimin
    };

    postFollower = async (user_id, follower_user_id) => {

        try {
            const findFollower = await this.followerRepository.findFollower(user_id, follower_user_id)
            if (findFollower) {
                return { message: "이미 추가된 팔로워 입니다" };
            } else {
                await this.followerRepository.postFollower(
                    user_id,
                    follower_user_id
                );
                return { message: "팔로워 추가 완료" };
            }
        } catch (error) {
            console.error(error)
        }

    };
    deleteFollower = async (user_id, follower_user_id) => {
        const deleteFollowData = await this.followerRepository.findFollower(
            user_id,
            follower_user_id
        );
        if (!deleteFollowData) {
            return { message: "팔로우 하고 있지 않은 팔로워 입니다" };
        } else {
            await this.followerRepository.deleteFollower(
                user_id,
                follower_user_id
            );
            return { message: "팔로워 취소 완료" };
        }

    };
}

module.exports = FollowerService;
