/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

// const CardOnTable = require("./cardsOnTable");
const Game = require("./game");
// const Deck = require("./deck");
const Player = require("./player");
const enums = require("./enums");

const MIN_PLAYER_PER_GAME = 2;
const MAX_PLAYER_PER_GAME = 4;

class GameManager {

    constructor() {
        this._players = [];
        this._games = {};
        // this._notifyOnPlayerAdded = null;
    }

    // player name is unique
    getPlayer(playerName) {
        return this._players[playerName];
    }

    getGame(gameId) {
        return this._games[gameId];
    }

    getGameState(gameId, playerId){
        this._games[gameId].getActivePlayer()
    }

    // setNotifyOnPlayerAdded(callback) {
    //     this._notifyOnPlayerAdded = callback;
    // }

    /**
     * @param playerName suppose to be unique
     */
    addPlayer(playerName) {
        this._players[playerName]= new Player(playerName, false);
    }

    removePlayer(playerNameToDelete) {
        // TODO add validations
        delete this._players[playerNameToDelete];
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

// singleton
let gameManager = (function () {
    let instance;

    function createInstance() {
        return new GameManager();
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