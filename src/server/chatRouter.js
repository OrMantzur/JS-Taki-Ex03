const express = require('express');
const bodyParser = require('body-parser');
const playersManager = require('./logic/playersManager');
const gameManager = require('./logic/gamesManager.js');
const chatManagement = express.Router();

chatManagement.use(bodyParser.text());

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
    activeGame.addChatMessage(playerName, `user had exit the game`);
};

module.exports = chatManagement;
