require("dotenv").config();
const express = require('express');
const cors = require('./config/cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const router = require('./routes');
const sessionMiddleware = require('./middleware/session');
const connectDB = require('./utils/connectToDB');
const { scheduleCleanup } = require('./jobs/trashCleanup')
require('./utils/passportSetup');

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;


app.use(cookieParser());
app.use(express.json());
app.use(cors);


app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.use((err, _, res, __) => {
    if (!err) return res.sendStatus(404)
    return res.status(500).send({ message: err.message || "INTERNAL SERVER ERROR" });
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(SERVER_PORT, () => {
            console.log(`✅ Server listening at port ${SERVER_PORT}`);
            scheduleCleanup();
        });
    } catch (err) {
        console.error('⛔ Failed to start the server:', err);
    }
};
startServer();

module.exports = app;