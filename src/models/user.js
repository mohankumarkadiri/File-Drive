const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        index: true
    },
    profileImage: {
        type: String
    },
},
    {
        timestamps: true,
        collection: 'Users'
    }
)


module.exports = model("User", userSchema);