const userRouter = require('express').Router();
const { isAuthenticated } = require('../middleware/auth');
const { fetchCurrentUserDetails, fetchUsers } = require('../controllers/user');

userRouter.get('/me', isAuthenticated, fetchCurrentUserDetails);
userRouter.get('/', isAuthenticated, fetchUsers);


module.exports = userRouter;
