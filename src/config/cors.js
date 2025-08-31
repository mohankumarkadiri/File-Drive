const cors = require('cors');

const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173", "https://filedrive.mohankumar.in"]
const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"]

module.exports = cors({
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, origin)
        } else {
            callback(new Error("Origin is not allowed"));
        }
    },
    methods: ALLOWED_METHODS,
    credentials: true
})

