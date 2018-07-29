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
const Card = require("./logic/card").Card;
const chatManagement = require('./chatRouter');
const enums = require('./logic/enums');

activeGameRouter.get('/gameState', playersManager.getLoggedInPlayer, (req, res) => {
    let loggedInPlayer = req.session.loggedInPlayer;
    let loggedInPlayerId = req.session.id;
    let activeGame = gameManager.getGameObjectByPlayerId(loggedInPlayer.getId());
    let topCardOnTable = activeGame.viewTopCardOnTable() ? new Card(activeGame.viewTopCardOnTable()._value, activeGame.viewTopCardOnTable()._color) : null;
    let userMessage = topCardOnTable ? topCardOnTable.getUserMessage() : null;
    let gameState = {
        loggedInPlayerName: loggedInPlayer._playerName,
        playerWon: activeGame.getGameState().gameState === enums.GameState.GAME_ENDED,
        activePlayer: activeGame.getActivePlayer(),
        //TODO slice at the end? was originally this.game.getFirstHumanPlayer().getCards().slice()
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
            // regularPlayerStats: activeGame.getPlayer(loggedInPlayerId).getStatistics(),
            // TODO get other players statistics
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
