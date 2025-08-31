const multer = require('multer');
const { MB_IN_BYTES } = require('../constants');

const storage = multer.memoryStorage()

module.exports = multer({
    storage,
    limits: { fileSize: 50 * MB_IN_BYTES }
})