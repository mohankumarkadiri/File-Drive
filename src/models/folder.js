const { model, Schema } = require('mongoose');
const sharedWithSchema = require('./sharedWith');

const folderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
        index: true
    },
    path: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    sharedWith: [sharedWithSchema],
    inTrash: {
        type: Boolean,
        default: false,
        index: true
    },
    trashedAt: { type: Date }
}, {
    timestamps: true,
    collection: 'Folders'
});

folderSchema.index({ owner: 1, parentId: 1, name: 1 }, { unique: true });

folderSchema.index({ name: 'text' });

module.exports = model('Folder', folderSchema);