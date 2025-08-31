const session = require('express-session');
const MongoStore = require('connect-mongo');
const MONGODB_URI = require('../config/db');
const { MILLI_SECONDS_IN_ONE_DAY } = require('../constants');

const sessionMiddleware = (req, res, next) => {
    const origin = req?.headers?.origin;
    let cookieInfo = {
        maxAge: MILLI_SECONDS_IN_ONE_DAY,
    }

    if (process.env.PRODUCTION_ENV === 'true') {
        // set response headers for Cross Domain Requests
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        // set sameSite to none for cross domain requests
        cookieInfo.sameSite = 'none';
        cookieInfo.secure = true;
    }

    return session({
        name: "File-Drive",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: MONGODB_URI }),
        cookie: {
            maxAge: MILLI_SECONDS_IN_ONE_DAY,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    })(req, res, next);
}

module.exports = sessionMiddleware;