/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
// import {Game, GameType, GameState} from "./logic/game.js"
const express = require('express');
const gameManager = require('./logic/gamesManager.js');
const playersManager = require('./logic/playersManager');
const activeGameRouter = express.Router();
const Game = require("./logic/game.js").Game;
const enums = require('./logic/enums');

activeGameRouter.get('/gameState', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let loggedInPlayerId = req.session.id;
    let activeGame = gameManager.getGameObjectByPlayerId(loggedInPlayer.getId());
    let userMessage = activeGame.viewTopCardOnTable() ? activeGame.viewTopCardOnTable().getUserMessage() : null;
    let gameState = {
        playerWon: activeGame.getGameState().gameState === enums.GameState.playerWon,
        activePlayer: activeGame.getActivePlayer(),
        //TODO slice at the end? was originally this.game.getFirstHumanPlayer().getCards().slice()
        playerCards: activeGame.getPlayer(req.session.id).getCards(),
        otherPlayersCards: activeGame.getOtherPlayersCards(loggedInPlayerId),
        topCardOnTable: activeGame.viewTopCardOnTable(),
        currentGameState: activeGame.getGameState(),
        //TODO not sure if we need to check for null here
        userMessage: userMessage !== null ? userMessage : null,
        gameControlsLocked: activeGame.getActivePlayer().getId() !== loggedInPlayerId,
        possibleMoveForActivePlayer: activeGame.getPossibleMoveForActivePlayer(),
        statistics: {
            gameStatistics: activeGame.getStatistics(),
            regularPlayerStats: activeGame.getPlayer(loggedInPlayerId).getStatistics(),
            // TODO get other players statistics
            computerPlayerStats: activeGame.getPlayer(loggedInPlayerId).getStatistics(),
        }
    }

    res.json(gameState);
});

activeGameRouter.post('/makeMove', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGame = gameManager.getGameObjectByPlayerId(loggedInPlayer.getId());
    let body = JSON.parse(req.body);
    activeGame.makeMove(body.cardClicked, body.additionalData)
    // TODO what should we return?
});

activeGameRouter.get('/clickedDeck', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGame = gameManager.getGameObjectByPlayerId(loggedInPlayer.getId());
    res.json(activeGame.takeCardsFromDeck());
});


module.exports = activeGameRouter;
