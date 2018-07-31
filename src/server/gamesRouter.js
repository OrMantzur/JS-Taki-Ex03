/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const express = require('express');
const gameManager = require('./logic/gamesManager.js');
const playersManager = require('./logic/playersManager');
const chatManagement = require('./chatRouter');
const gamesRouter = express.Router();

/**
 *  get the game id associated with the session
 */
gamesRouter.get('/activeGameId', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGameId = gameManager.getGameIdByPlayerId(loggedInPlayer.getId());
    res.json({activeGameId: activeGameId});
});

/**
 * add a new game to the games list
 */
gamesRouter.post('/addGame', playersManager.getLoggedInPlayer, (req, res) => {
    const gameCreator = req.session.loggedInPlayer;
    let gameParams = JSON.parse(req.body);

    // addGame returns true if game was successfully added
    let addGameStatus = gameManager.addGame(gameParams.gameType, gameParams.numPlayers, gameParams.gameTitle, gameCreator);
    if (addGameStatus.valid) {
        res.sendStatus(200);
    } else {
        res.status(403).send(addGameStatus.errorMessage);
    }
});

/**
 * delete a game from the games list
 */
gamesRouter.post('/deleteGame', playersManager.getLoggedInPlayer, (req, res) => {
    let gameId = JSON.parse(req.body).gameId;
    let loggedInPlayer = req.session.loggedInPlayer;
    let errorMessage;
    if (gameId !== undefined) {
        errorMessage = gameManager.removeGame(gameId, loggedInPlayer);
        if (errorMessage !== undefined) {
            res.status(403).json(errorMessage);
        } else {
            res.sendStatus(200);
        }
    }
});

/**
 * get all games from the server
 */
gamesRouter.get('/allGames', playersManager.getLoggedInPlayer, (req, res) => {
    res.json(gameManager.getAllGames());
});

/**
 * add the active player (associated with the session) to the gameId given the the body of the request
 */
gamesRouter.post('/joinGame', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let gameId = JSON.parse(req.body).gameId;
    req.session.activeGameId = gameId;
    gameManager.addPlayerToGame(gameId, loggedInPlayer);
    chatManagement.appendUserLoginMessage(gameId, loggedInPlayer.getName());
    res.sendStatus(200);
});

module.exports = gamesRouter;
