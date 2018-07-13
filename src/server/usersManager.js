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

// TODO /logout resource

module.exports = userManager;
