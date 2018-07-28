/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
// import {Game, GameType, GameState} from "./logic/game.js"
const express = require('express');
const gameManager = require('./logic/gamesManager.js');
const playersManager = require('./logic/playersManager');
const gamesRouter = express.Router();

gamesRouter.get('/activeGameId', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGameId = gameManager.getGameIdByPlayerId(loggedInPlayer.getId());
    res.json({activeGameId: activeGameId});
});

gamesRouter.post('/addGame', playersManager.getLoggedInPlayer, (req, res) => {
    const playerName = req.session.loggedInPlayer.getName();
    let gameParams = JSON.parse(req.body);

    // addGame returns true if game was successfully added
    gameManager.addGame(gameParams.gameType, gameParams.numPlayers, gameParams.gameTitle, playerName) ? res.sendStatus(200) : res.sendStatus(403);

});

gamesRouter.get('/deleteGame', playersManager.removePlayer, (req, res) => {
    const gameId = res.gameId;
    if (gameId !== undefined) {
        gameManager.removeGame(gameId);
    }
    res.sendStatus(200);
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

module.exports = gamesRouter;
