const express = require('express');
const playersManager = require('./logic/playersManager');
const gameManager = require('./logic/gamesManager.js');
const chatManagement = express.Router();

chatManagement.route('/')
    .get(playersManager.getLoggedInPlayer, (req, res) => {
        let loggedInPlayer = req.session.loggedInPlayer;
        let activeGameId = gameManager.getGameIdByPlayerId(loggedInPlayer.getId());
        let activeGame = gameManager.getGame(activeGameId);
        res.json(activeGame.getChatContent());
    })
    .post(playersManager.getLoggedInPlayer, (req, res) => {
        const body = req.body;
        let loggedInPlayer = req.session.loggedInPlayer;
        let activeGameId = gameManager.getGameIdByPlayerId(loggedInPlayer.getId());
        let activeGame = gameManager.getGame(activeGameId);
        activeGame.addChatMessage(loggedInPlayer.getName(), body);
        res.sendStatus(200);
    });

chatManagement.appendUserLogoutMessage = function (activeGameId, playerName) {
    let activeGame = gameManager.getGame(activeGameId);
    activeGame.addChatMessage(playerName, `has left the game`);
};

chatManagement.appendUserLoginMessage = function (activeGameId, playerName) {
    let activeGame = gameManager.getGame(activeGameId);
    activeGame.addChatMessage(playerName, `has joined the game`);
};

module.exports = chatManagement;
