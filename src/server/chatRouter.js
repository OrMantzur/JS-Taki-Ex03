const express = require('express');
const bodyParser = require('body-parser');
const playersManager = require('./logic/playersManager');
const chatManagement = express.Router();
const chatContent = [];

chatManagement.use(bodyParser.text());

chatManagement.route('/')
    .get((req, res) => {
        res.json(chatContent);
    })
    .post(playersManager.getLoggedInPlayer, (req, res) => {
        const body = req.body;
        let loggedInPlayer = req.session.loggedInPlayer;
        chatContent.push({user: loggedInPlayer.getName(), text: body});
        res.sendStatus(200);
    });


// chatManagement.post('/logout', playersManager.getLoggedInPlayer, (req, res) => {
//     let loggedInPlayer = req.session.loggedInPlayer;
//     chatContent.push({user: userInfo, text: `user had logout`});
//     res.sendStatus(200);
// });

chatManagement.appendUserLogoutMessage = function (userInfo) {
    chatContent.push({user: userInfo, text: `user had exit the game`});
};

module.exports = chatManagement;
