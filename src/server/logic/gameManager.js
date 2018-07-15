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
        // TODO
    }

    getGame(gameId) {
        // TODO
    }

    /**
     * @param playerName suppose to be unique
     */
    addPlayer(playerName) {
        this._players.push(new Player(playerName, false));
    }

    removePlayer(playerNameToDelete) {
        let playerIndexInArray = this._players.findIndex(player => {
            return player.getName() === playerNameToDelete;
        });
        if (playerIndexInArray > -1) {
            this._players.splice(playerIndexInArray, 1);
        }
    }

    addGame() {
        // TODO
    }

}

module.exports = GameManager;
