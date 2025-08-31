const shareRouter = require('express').Router();
const { isAuthenticated } = require('../middleware/auth');
const { createShare, resolveShare } = require('../controllers/share');

shareRouter.post('/', isAuthenticated, createShare);
shareRouter.get('/:token', resolveShare);

module.exports = shareRouter;