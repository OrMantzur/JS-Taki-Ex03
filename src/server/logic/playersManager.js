/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const Player = require("./player");
const _ = require("lodash");

/**
 * all the changes in userList in userManager go through that module
 */

/**
 * list of <sessionId, Player>
 * playerName and userName are unique
 */
const players = {};

function getLoggedInPlayer(req, res, next) {
    let loggedInPlayer = players[req.session.id];
    if (loggedInPlayer === undefined) {
        res.status(401).send("User is not logged in")
    } else {
        req.session.loggedInPlayer = loggedInPlayer;
        next()
    }
}

/**
 *  add user if user session and user name not already in system
 */
function addPlayer(req, res) {
    let sessionId = req.session.id;
    if (players[sessionId] !== undefined) {
        res.status(403).send("user already logged in as " + players[sessionId].getName());
    } else {
        // validate user name not already in system
        let playerNameToAdd = JSON.parse(req.body).playerName;
        for (let currId in players) {
            let playerNameInSystem = players[currId].getName();
            if (playerNameToAdd === playerNameInSystem) {
                res.status(403).send("user name already exist");
                return;
            }
        }
        if (playerNameToAdd !== undefined && playerNameToAdd !== null) {
            playerNameToAdd = playerNameToAdd.trim();
            if (playerNameToAdd.length > 0) {
                /* add player */
                // we got here only when the user is validate
                players[sessionId] = new Player(sessionId, playerNameToAdd, false);
                // send to next middleware request
                res.json(players[sessionId]);
            } else {
                res.status(403).send("user name can't be empty string");
            }
        }
    }
}

function removePlayer(req, res, next) {
    if (players[req.session.id] === undefined) {
        res.status(403).send("user doesn't exist");
    } else {
        // send to next middleware request
        res.deletedPlayerName = players[req.session.id].getName();
        // delete that key and value
        delete players[req.session.id];
        res.status(200).send(res.deletedPlayerName + " has been removed");
        next();
    }
}

module.exports = {players, getLoggedInPlayer, addPlayer, removePlayer};
