const folderRouter = require('express').Router();
const { isAuthenticated } = require('../middleware/auth');
const { createFolder, listContents, renameFolder, shareFolder, updatePermissions } = require('../controllers/folder');

folderRouter.post('/', isAuthenticated, createFolder);
folderRouter.get('/', isAuthenticated, listContents);
folderRouter.put('/:folderId/rename', isAuthenticated, renameFolder);
folderRouter.put('/:folderId/share', isAuthenticated, shareFolder);
folderRouter.put('/:folderId/permissions', isAuthenticated, updatePermissions)

module.exports = folderRouter;