/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const express = require('express');
const userManager = express.Router();

// list of <sessionId, userName>
const users = [];

userManager.post('/addUser', (req, res) => {
    let userName = req.body;
    users.push({userName: userName, sessionId: req.session.id});
    res.json({name: userName});
    res.sendStatus(200);
});

userManager.get('/allUsers', (req, res) => {
    res.json(users);
});

module.exports = userManager;
