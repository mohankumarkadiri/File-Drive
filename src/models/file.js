const { Schema, model } = require('mongoose');
const sharedWithSchema = require('./sharedWith');

const fileSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    folderId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
        index: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    path: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    sharedWith: [sharedWithSchema],
    inTrash: {
        type: Boolean,
        default: false,
        index: true
    },
    trashedAt: { type: Date }
},
    {
        timestamps: true,
        collection: 'Files'
    });

fileSchema.index({ owner: 1, folderId: 1, name: 1 }, { unique: true });

fileSchema.index({ name: 'text' });

module.exports = model('File', fileSchema);