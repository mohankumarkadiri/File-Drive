const folderModel = require('../models/folder');
const fileModel = require('../models/file');
const { hasAccessToFolder } = require('../services/access');
const { EDITOR, OWNER } = require('../constants');

const createFolder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, parentId } = req.body;

        let basePath = `${userId}/root`;
        if (parentId) {
            const { access, folder: parentFolder } = await hasAccessToFolder(userId, parentId);
            if (!access || ![EDITOR, OWNER].includes(access)) return res.status(400).send({ message: 'Not allowed to create folder in the parent directory' });
            basePath = parentFolder.path;
        }
        const path = `${basePath}/${name}`.replace(/\/+/g, '/');

        const folder = await folderModel.create({
            name,
            owner: userId,
            parentId: parentId || null,
            path
        });
        return res.status(201).send(folder);
    } catch (err) {
        if (err && err.code === 11000) return res.status(409).send({ error: 'Folder already exists' });
        return res.status(500).send({ message: err.message });
    }
};

const listContents = async (req, res) => {
    try {
        const userId = req.user._id;
        const parentId = req.query.folderId || null;
        const includeTrash = req.query.includeTrash === "true";
        const includeTrashFilter = includeTrash ? {} : { inTrash: false };
        const projection = includeTrash ? {} : { inTrash: 0 };

        const folders = await folderModel.find({
            parentId,
            $or: [
                { owner: userId },
                { 'sharedWith.userId': userId }
            ],
            ...includeTrashFilter
        }, projection).sort({ name: 1 }).lean();

        const files = await fileModel.find({
            folderId: parentId,
            $or: [
                { owner: userId },
                { 'sharedWith.userId': userId }
            ],
            ...includeTrashFilter
        }, projection).sort({ name: 1 }).lean();

        return res.send({ folders, files });
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
};

module.exports = {
    listContents,
    createFolder
}