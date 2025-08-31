const fileModel = require('../models/file');
const storage = require('../storage/s3Driver');
const { hasAccessToFolder, hasAccessToFile } = require('../services/access');
const logger = require('../utils/logger');
const { EDITOR, OWNER } = require('../constants')


const upload = async (req, res) => {
    try {
        const userId = req.user._id;
        const { folderId } = req.body;
        const file = req.file;
        if (!file) return res.status(400).send({ message: 'No file uploaded' });

        if (folderId) {
            const { access } = await hasAccessToFolder(userId, folderId);
            if (!access) return res.status(403).send({ message: 'No access to folder' });
            if (![EDITOR, OWNER].includes(access)) {
                return res.status(403).send({ message: 'Insufficient permission to upload' });
            }
        }

        const key = `${userId}/${folderId || 'root'}/${file.originalname}`;

        await storage.putObject(key, file.buffer, file.mimetype);

        const doc = await fileModel.create({
            name: file.originalname,
            folderId: folderId || null,
            owner: userId,
            path: key,
            size: file.size,
            mimeType: file.mimetype
        });

        return res.status(201).send(doc);
    } catch (err) {
        logger.error({ err }, 'Upload failed');
        if (err && err.code === 11000) return res.status(409).send({ message: 'File with same name already exists' });
        return res.status(500).send({ message: err.message });
    }
};

const download = async (req, res) => {
    try {
        const userId = req.user._id;
        const fileId = req.params.id;

        const { access, file } = await hasAccessToFile(userId, fileId);
        if (!access) return res.status(403).send({ message: 'No access to file' });

        res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);

        const stream = storage.getObjectStream(file.path);
        stream.on('error', (err) => {
            logger.error({ err }, 'Stream error');
            res.status(500).end();
        });
        stream.pipe(res);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

const trash = async (req, res) => {
    try {
        const userId = req.user._id;
        const fileId = req.params.id;

        const { access, file } = await hasAccessToFile(userId, fileId);
        if (![EDITOR, OWNER].includes(access)) return res.status(403).send({ message: 'No access to file' });

        file.inTrash = true;
        file.trashedAt = new Date();
        await file.save();
        return res.status(200).send({ message: 'Successfully moved file to trash' });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

/** Permanent file deletion */
const deleteFile = async (req, res) => {
    try {
        const userId = req.user._id;
        const fileId = req.params.id;

        const { access, file } = await hasAccessToFile(userId, fileId);
        if (![EDITOR, OWNER].includes(access)) return res.status(403).send({ message: 'No access to file' });

        // delete file from S3
        await storage.deleteObject(file.path);

        // delete metadata from mongodb
        await fileModel.findByIdAndDelete(file._id);

        return res.status(200).send({ message: 'Permanently deleted the file' })
    } catch (error) {
        return res.status(500).send({ message: error.message || 'Failed to delete the file' })
    }
}

const share = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fileId } = req.params;
        const sharedWith = req.body;

        const { access } = await hasAccessToFile(userId, fileId);
        if (access !== OWNER) return res.status(403).send({ message: 'Insufficient Permissions to share file with others' })

        const updatedFile = await fileModel.findByIdAndUpdate(fileId, { $addToSet: { sharedWith } }, { new: true }).lean()

        return res.status(200).send(updatedFile)

    } catch (error) {
        return res.status(500).send({ message: error.message || 'Failed to share file with others' })
    }
}

const updatePermissions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fileId } = req.params;
        const { userId: sharedWithUserId, permission } = req.body;

        const { access } = await hasAccessToFile(userId, fileId);
        if (access !== OWNER) {
            return res.status(403).send({ message: 'Insufficient permissions to update file permissions' })
        }

        const updatedFile = await fileModel.findOneAndUpdate({
            _id: fileId, 'sharedWith.userId': sharedWithUserId
        },
            { $set: { 'sharedWith.$.permission': permission } },
            { new: true }
        ).lean()

        if (!updatedFile) {
            return res.status(404).send({ message: 'User not found in shared list' })
        }

        return res.status(200).send(updatedFile);
    } catch (error) {
        return res.status(500).send({ message: error.message || 'Failed to update file permissions' })
    }
}

module.exports = {
    upload,
    download,
    trash,
    deleteFile,
    share,
    updatePermissions
}