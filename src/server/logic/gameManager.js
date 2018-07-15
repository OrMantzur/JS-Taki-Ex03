/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const CardOnTable = require("./cardsOnTable");
const Game = require("./game");
const Deck = require("./deck");
const Player = require("./player");

class GameManager {

    constructor() {
        this._players = [];
        this._games = [];
    }

    getPlayer(playerId) {

    }

    getGame(gameId) {

    }

    /**
     * @param playerName suppose to be unique
     */
    addPlayer(playerName) {
        this._players.push(new Player(playerName, false));
    }

    addGame() {

    }

}

module.exports = GameManager;
