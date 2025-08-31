const File = require('../models/file');
const Folder = require('../models/folder');
const { OWNER } = require('../constants');

async function hasAccessToFile(userId, fileId) {
	const file = await File.findById(fileId).lean();
	if (!file) return { access: false };
	if (String(file.owner) === String(userId)) return { access: OWNER, file };
	const shared = (file.sharedWith || []).find(s => String(s.userId) === String(userId));
	if (shared) return { access: shared.permission, file };
	if (file.folderId) {
		const { access } = await hasAccessToFolder(userId, file.folderId);
		return { access, file }
	}
	return { access: false };
}

async function hasAccessToFolder(userId, folderId) {
	const folder = await Folder.findById(folderId).lean();
	if (!folder) return { access: false };
	if (String(folder.owner) === String(userId)) return { access: OWNER, folder };
	const shared = (folder.sharedWith || []).find(s => String(s.userId) === String(userId));
	if (shared) return { access: shared.permission, folder };
	return { access: false };
}

module.exports = { hasAccessToFile, hasAccessToFolder };
