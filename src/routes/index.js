const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const fileRouter = require('./file');
const folderRouter = require('./folder');
const shareRouter = require('./share');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/file', fileRouter);
router.use('/folder', folderRouter);

module.exports = router;