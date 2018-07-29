/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
// import {Game, GameType, GameState} from "./logic/game.js"
const express = require('express');
const gameManager = require('./logic/gamesManager.js');
const playersManager = require('./logic/playersManager');
const gamesRouter = express.Router();
const chatManagement = require('./chatRouter');

gamesRouter.get('/activeGameId', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGameId = gameManager.getGameIdByPlayerId(loggedInPlayer.getId());
    res.json({activeGameId: activeGameId});
});

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

gamesRouter.get('/allGames', playersManager.getLoggedInPlayer, (req, res) => {
    res.json(gameManager.getAllGames());
});

// get in the request gameId
gamesRouter.post('/joinGame', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let gameId = JSON.parse(req.body).gameId;
    req.session.activeGameId = gameId;
    gameManager.addPlayerToGame(gameId, loggedInPlayer);
    res.sendStatus(200);
});

// get in the request gameId
gamesRouter.post('/exitGame', playersManager.getLoggedInPlayer, (req, res) => {
    // TODO exit game

    // TODO check the chat exit work
    let playerName = req.session.loggedInPlayer.getName();
    chatManagement.appendUserLogoutMessage(playerName );
    res.sendStatus(200);
});

module.exports = gamesRouter;
