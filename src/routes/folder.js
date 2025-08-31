const folderRouter = require('express').Router();
const { isAuthenticated } = require('../middleware/auth');
const { createFolder, listContents, renameFolder } = require('../controllers/folder');

folderRouter.post('/', isAuthenticated, createFolder);
folderRouter.get('/', isAuthenticated, listContents);
folderRouter.put('/:folderId/rename', isAuthenticated, renameFolder);

module.exports = folderRouter;