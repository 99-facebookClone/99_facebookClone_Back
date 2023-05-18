const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();
const uploadImage = require('../middlewares/multer-s3');

//1. 회원가입 API
//api/auth/signup
router.post('/signup', uploadImage.array('img', 4), usersController.signup);

//2.로그인 API
//api/auth/login
router.post('/login', usersController.login);

module.exports = router;
