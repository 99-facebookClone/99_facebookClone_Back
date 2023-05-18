const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users.controller");
const usersController = new UsersController();

router.get("/:name", usersController.searchUser);



module.exports = router;
