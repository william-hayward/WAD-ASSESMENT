const express = require('express');
const userRouter = express.Router();

const con = require('../mysqlconn');

const UserController = require('../controller/userController');
const uController = new UserController(con);

userRouter.get('/all', uController.findAllUsers.bind(uController));
userRouter.get('/:username', uController.findUserByUsername.bind(uController));

module.exports = userRouter;