const { Schema } = require('mongoose');
const { VIEWER, EDITOR } = require('../constants');

const sharedWithSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    permission: {
        type: String,
        enum: [VIEWER, EDITOR],
        required: true
    }
}, { _id: false });

module.exports = sharedWithSchema