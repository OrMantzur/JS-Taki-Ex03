/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

/**
 * manage all the user management
 * use {@code userAuth} for authentication all change in {@code users}
 */

const express = require('express');
const usersRouter = express.Router();
const playersManager = require('./logic/playersManager');

usersRouter.post('/addPlayer', playersManager.addPlayer);

usersRouter.get('/allUsers', playersManager.getLoggedInPlayer, (req, res) => {
    res.json(playersManager.players);
});

usersRouter.get('/activePlayer', playersManager.getLoggedInPlayer, (req, res) => {
    res.json(req.session.loggedInPlayer);
});

usersRouter.get('/logout', playersManager.removePlayer);

module.exports = usersRouter;
