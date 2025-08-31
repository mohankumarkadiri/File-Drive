const fileRouter = require('express').Router();
const { isAuthenticated } = require('../middleware/auth');
const multerUpload = require('../middleware/upload');
const { upload, download, trash } = require('../controllers/file');


fileRouter.post('/upload', isAuthenticated, multerUpload.single('file'), upload);
fileRouter.get('/:id/download', isAuthenticated, download);
fileRouter.put('/:id/trash', isAuthenticated, trash);

module.exports = fileRouter;