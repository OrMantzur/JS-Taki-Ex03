/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

/**
 * manage all the user management
 * use {@code userAuth} for authentication all change in {@code users}
 */

const express = require('express');
const gameManager = require('./logic/gameManager.js');
const usersRouter = express.Router();
const userAuth = require('./userAuth');

usersRouter.post('/addUser', userAuth.addUser, (req, res) => {
    const userName = res.addedUserName;
    if (userName !== undefined) {
        gameManager.addPlayer(userName);
    }
    res.sendStatus(200);
});

usersRouter.get('/allUsers', userAuth.checkUserAuth, (req, res) => {
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

usersRouter.get('/activeUserName', userAuth.checkUserAuth, (req, res) => {
    res.json(userAuth.getUserName(req.session.id));
});

usersRouter.get('/logout', userAuth.removeUser, (req, res) => {
    const userName = res.deletedUserName;
    if (userName !== undefined) {
        gameManager.removePlayer(userName);
    }
    res.sendStatus(200);
});

module.exports = usersRouter;
