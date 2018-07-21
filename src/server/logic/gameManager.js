/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const CardOnTable = require("./cardsOnTable");
const Game = require("./game");
const Deck = require("./deck");
const Player = require("./player");
const enums = require("./enums");

const MIN_PLAYER_PER_GAME = 2;
const MAX_PLAYER_PER_GAME = 4;

class GameManager {
    constructor() {
        this._players = [];
        this._games = {};
        this._notifyOnPlayerAdded = null;
    }

    getPlayer(playerId) {
        return this._players[playerId];
    }

    getGame(gameId) {
        return this._games[gameId];
    }

    setNotifyOnPlayerAdded(callback) {
        this._notifyOnPlayerAdded = callback;
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

    getAllGames() {
        return this._games;
    }

    addGame(gameType, playersNum, gameName, gameCreator) {
        // validate all values
        if (!(gameType === enums.GameType.BASIC || gameType === enums.GameType.ADVANCED) ||
            playersNum > MAX_PLAYER_PER_GAME || playersNum < MIN_PLAYER_PER_GAME ||
            !gameName || !gameCreator)
            return false;

        let game = new Game.Game(gameType, playersNum, gameName, gameCreator);
        this._games[game.getGameId()] = game;
        return true;
    }

    removeGame(gameId) {
        // TODO add validations
        delete this._games[gameId];
    }
}

var gameManager = (function () {
    var instance;

    function createInstance() {
        var object = new GameManager();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})().getInstance();

module.exports = gameManager;
