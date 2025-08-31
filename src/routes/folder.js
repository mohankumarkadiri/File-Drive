const folderRouter = require('express').Router();
const { isAuthenticated } = require('../middleware/auth');
const { createFolder, listContents } = require('../controllers/folder');

folderRouter.post('/', isAuthenticated, createFolder);
folderRouter.get('/', isAuthenticated, listContents);

module.exports = folderRouter;