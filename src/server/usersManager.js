/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

/**
 * manage all the user management
 * use {@code userAuth} for authentication all change in {@code users}
 */

const express = require('express');
const userManager = express.Router();
const userAuth = require('./userAuth');

userManager.post('/addUser', userAuth.addUser, (req, res) => {
    res.sendStatus(200);
});

userManager.get('/allUsers', userAuth.checkUserAuth, (req, res) => {
    let usersMap = Object
        .keys(userAuth.users)
        .map(key => {
            const keyValue = {};
            keyValue["sessionId"] = key;
            keyValue["userName"] = userAuth.users[key];
            return keyValue;
        });
    res.json(usersMap);
});

userManager.get('/activeUserName', userAuth.checkUserAuth, (req, res) => {
    const userName = userAuth.getUserName(req.session.id);
    res.json(userName);
});

userManager.get('/logout', userAuth.removeUser, (req, res) => {
        res.sendStatus(200);
    }
);

module.exports = userManager;
