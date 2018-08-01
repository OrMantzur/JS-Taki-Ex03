/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const express = require('express');
const playersManager = require('../logic/playersManager');
const playersRouter = express.Router();

/**
 * add a new player to the logged in players list
 */
playersRouter.post('/addPlayer', playersManager.addPlayer);

/**
 * get a list of all logged in players
 */
playersRouter.get('/allPlayers', playersManager.getLoggedInPlayer, (req, res) => {
    res.json(playersManager.players);
});

/**
 * get the current session's active player
 */
playersRouter.get('/activePlayer', playersManager.getLoggedInPlayer, (req, res) => {
    res.json(req.session.loggedInPlayer);
});

/**
 * remove the current session's active player from the logged in players list and the session
 */
playersRouter.get('/logout', playersManager.removePlayer);

module.exports = playersRouter;
