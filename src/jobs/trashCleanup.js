const cron = require('node-cron');
const fileModel = require('../models/file');
const storage = require('../storage/s3Driver');
const logger = require('../utils/logger');
const { MILLI_SECONDS_IN_ONE_DAY } = require('../constants');

async function cleanupOnce() {
    const RETENTION_DAYS = Number(process.env.RETENTION_DAYS || 30);
    const cutoff = new Date(Date.now() - RETENTION_DAYS * MILLI_SECONDS_IN_ONE_DAY);

    const files = await fileModel.find({ inTrash: true, trashedAt: { $lt: cutoff } }).limit(500).lean();
    for (const file of files) {
        try {
            await storage.deleteObject(file.path);
            await fileModel.deleteOne({ _id: file._id });
            logger.info({ fileId: file._id }, 'Deleted trashed file');
        } catch (err) {
            logger.error({ err, fileId: file._id }, 'Failed to permanently delete trashed file');
        }
    }
}

function scheduleCleanup() {
    console.log(`✅ Trash cleanup job is scheduled`)
    cron.schedule('0 0 * * *', async () => {
        try {
            await cleanupOnce();
        } catch (err) {
            logger.error({ err }, 'Trash cleanup failed');
        }
    },
        {
            name: 'Trash Cleanup',
            timezone: 'Asia/Kolkata'
        });
}

module.exports = { scheduleCleanup, cleanupOnce };