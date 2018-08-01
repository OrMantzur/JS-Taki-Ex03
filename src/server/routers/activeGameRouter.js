/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const express = require('express');
const gameManager = require('../logic/gamesManager.js');
const playersManager = require('../logic/playersManager');
const Card = require("../logic/card").Card;
const chatManagement = require('./chatRouter');
const enums = require('../logic/enums');
const activeGameRouter = express.Router();

activeGameRouter.get('/gameState', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let loggedInPlayerId = req.session.id;
    let activeGame = gameManager.getGameObjectByPlayerId(loggedInPlayer.getId());
    let topCardOnTable = activeGame.viewTopCardOnTable() ? new Card(activeGame.viewTopCardOnTable()._value, activeGame.viewTopCardOnTable()._color) : null;
    let userMessage = topCardOnTable ? topCardOnTable.getUserMessage() : null;
    let gameState = {
        loggedInPlayer: loggedInPlayer,
        playerWon: activeGame.getGameState().gameState === enums.GameState.GAME_ENDED,
        activePlayer: activeGame.getActivePlayer(),
        playerCards: activeGame.getPlayer(req.session.id) !== undefined ? activeGame.getPlayer(req.session.id).getCards() : undefined,
        // otherPlayersCards: activeGame.getOtherPlayersCards(loggedInPlayerId),
        topCardOnTable: topCardOnTable,
        currentGameState: activeGame.getGameState(),
        //TODO not sure if we need to check for null here
        userMessage: userMessage !== null ? userMessage : null,
        gameControlsLocked: (
            activeGame.getActivePlayer() !== undefined ?
                (activeGame.getActivePlayer().getId() !== loggedInPlayerId || activeGame.getGameState().gameState === enums.GameState.WAITING_FOR_PLAYERS) :
                true
        ),
        possibleMoveForActivePlayer: activeGame.getPossibleMoveForActivePlayer(),
        statistics: {
            gameStatistics: activeGame.getStatistics(),
            allPlayerStats: activeGame.getAllPlayersStatistics(),
        }
    };

    res.json(gameState);
});

activeGameRouter.post('/makeMove', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGame = gameManager.getGameObjectByPlayerId(loggedInPlayer.getId());
    let body = JSON.parse(req.body);
    let makeMoveReturnedTrue = activeGame.makeMove(body.cardClicked, body.additionalData);
    makeMoveReturnedTrue ? res.sendStatus(202) : res.sendStatus(400);
    // TODO what should we return?
});

activeGameRouter.get('/clickedDeck', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGame = gameManager.getGameObjectByPlayerId(loggedInPlayer.getId());
    res.json(activeGame.takeCardsFromDeck());
});

activeGameRouter.get('/exitGame', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let activeGameId = gameManager.getGameIdByPlayerId(loggedInPlayer.getId());
    let activeGame = gameManager.getGame(activeGameId);
    activeGame.removePlayerFromGame(loggedInPlayer.getId());

    // TODO check the chat exit work
    // write that user exit to chat
    let playerName = req.session.loggedInPlayer.getName();
    chatManagement.appendUserLogoutMessage(activeGameId, playerName);
    res.sendStatus(200);
});

module.exports = activeGameRouter;
