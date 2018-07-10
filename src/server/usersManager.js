/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

// list of <sessionId, userName>
const users = {};

const express = require('express');
const userManager = express.Router();

userManager.post('/addUser', (req, res) => {
    let userName = req.body;
    users[req.session.id] = userName;
    res.json({name: userName});
    res.sendStatus(200);

});

// userManager.get('/allUsers', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify({ a: 1 }));
//     // res.json({"dfsa":"dasf"});
// });

module.exports = userManager;
