require('dotenv').config();
const express = require('express');
const passport = require('passport');


const authRouter = express.Router();

authRouter.delete('/logout', (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
        });
        return res.status(200).send('Logged Out Successfully!!!');
    } catch (err) {
        return res.status(500).send({ message: err });
    }
});

authRouter.get('/google', passport.authenticate('google', {
    prompt: ['select_account'],
    scope: ['openid', 'email', 'profile']
}));

authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/unauthorized',
    failureMessage: true
}), (_, res) => {
    res.redirect(`/auth/success`);
});

authRouter.get('/unauthorized', (req, res) => {
    const errorMessage = req.session.messages ? req?.session?.messages[0] : null;
    req.session.messages = [];
    return res.status(403).send(errorMessage || 'You are not authorized to access this site.');
});

authRouter.get('/success', (_, res) => res.send('✅ Authentication is done!'))


module.exports = authRouter;