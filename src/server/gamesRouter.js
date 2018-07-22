/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
// import {Game, GameType, GameState} from "./logic/game.js"
const express = require('express');
const gameManager = require('./logic/gameManager.js');
const userAuth = require('./userAuth');
const gamesRouter = express.Router();
const Game = require("./logic/game.js").Game;

gamesRouter.post('/addGame', userAuth.checkUserAuth, (req, res) => {
    const userName = userAuth.getUserName(req.session.id);
    let gameParams = JSON.parse(req.body);

    // addGame returns true if game was successfully added
    gameManager.addGame(gameParams.gameType, gameParams.numPlayers, gameParams.gameTitle, userName) ? res.sendStatus(200) : res.sendStatus(403);

});

gamesRouter.get('/deleteGame', userAuth.removeUser, (req, res) => {
    const gameId = res.gameId;
    if (gameId !== undefined) {
        gameManager.removeGame(gameId);
    }
    res.sendStatus(200);
});

gamesRouter.get('/allGames', userAuth.checkUserAuth, (req, res) => {
    res.json(gameManager.getAllGames());
});

// get in the request gameId
gamesRouter.post('/startGame', userAuth.checkUserAuth, (req, res) => {
    let gameId = JSON.parse(req.body).gameId;
    let activeGame = gameManager.getGame(gameId);
    let activeUserName = userAuth.getUserName(req.session.id);
    let activePlayer= gameManager.getPlayer(activeUserName);
    activeGame.addPlayerToGame(activePlayer);
    // return active game state
    res.json({
        gameName: activeGame.getGameName(),
        playersName: activeGame.getPlayerNameList(),
    });
});

module.exports = gamesRouter;
