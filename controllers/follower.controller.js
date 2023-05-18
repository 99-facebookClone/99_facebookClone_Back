const FollowerService = require("../services/follower.service")

class FollowerController {
    followerService = new FollowerService()

    getFollowerAll = async (req, res, next) => {
        const { user_id } = res.locals.user//3
        try {
            const getFollowData = await this.followerService.getFollowerAll(user_id)


            return res.status(200).json({ follow: getFollowData })
        } catch (error) {
            console.error(error)
            return res.status(400).json({ "errorMessage": "팔로워 목록 조회에 실패하였습니다." })
        }
    }

    postFollower = async (req, res, next) => {
        const { user_id } = res.locals.user
        const { follower_user_id } = req.body
        try {
            const postFollowData = await this.followerService.postFollower(user_id, follower_user_id);
            if (postFollowData.message === "이미 추가된 팔로워 입니다") {
                return res.status(400).json(postFollowData)
            } else {
                return res.status(200).json(postFollowData)
            }
        }
        catch (error) {
            console.error(error)

            return res.status(400).json({ "errorMessage": "팔로워 추가에 실패하였습니다." })
        }

    }

    deleteFollower = async (req, res, next) => {
        const { user_id } = res.locals.user
        const { follower_user_id } = req.params


        try {
            const deleteFollowData = await this.followerService.deleteFollower(user_id, follower_user_id);
            if (deleteFollowData.message === "팔로우 하고 있지 않은 팔로워 입니다") {
                return res.status(400).json(deleteFollowData)
            } else {
                return res.status(200).json(deleteFollowData)
            }

        } catch (error) {
            console.error(error)
            return res.status(400).json({ "errorMessage": "팔로워 취소에 실패하였습니다." })
        }

    }

}

module.exports = FollowerController