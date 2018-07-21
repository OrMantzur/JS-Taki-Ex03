/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
// import {Game, GameType, GameState} from "./logic/game.js"
const express = require('express');
const gameManager = require('./logic/gameManager.js');
const userAuth = require('./userAuth');
const gamesRouter = express.Router();

gamesRouter.post('/addGame', userAuth.checkUserAuth, (req, res) => {
    const userName = userAuth.getUserName(req.session.id);
    var gameParams = JSON.parse(req.body);

    // addGame returns true if game was successfully added
    gameManager.addGame(gameParams.gameType, gameParams.numPlayers, gameParams.gameTitle, userName) ? res.sendStatus(200) : res.sendStatus(403);

});

gamesRouter.get('/allGames', userAuth.checkUserAuth, (req, res) => {
    res.json(gameManager.getAllGames());
});

gamesRouter.get('/deleteGame', userAuth.removeUser, (req, res) => {
    const gameId = res.gameId;
    if (gameId !== undefined) {
        gameManager.removeGame(gameId);
    }
    res.sendStatus(200);
});

module.exports = gamesRouter;
