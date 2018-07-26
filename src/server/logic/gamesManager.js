/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

// const CardOnTable = require("./cardsOnTable");
const Game = require("./game");
const Player = require("./player");
// const Deck = require("./deck");
const enums = require("./enums");

const MIN_PLAYER_PER_GAME = 2;
const MAX_PLAYER_PER_GAME = 4;

class GamesManager {

    constructor() {
        this._games = {};
        this._playerToGameIdMap = {};
    }

    getGame(gameId) {
        return this._games[gameId];
    }

    getGameState(gameId, playerId) {
        this._games[gameId].getActivePlayer()
    }

    getGameByPlayerId(playerId) {
        return this._playerToGameIdMap[playerId];
    }

    /**
     * @param playerName suppose to be unique
     */
    // addPlayer(playerName, playerId) {
    //     if (this._players[playerId] !== undefined) {
    //         return false;
    //     }
    //
    //     this._players[playerId] = new Player(playerId, playerName, false);
    // }

    // removePlayer(playerId) {
    //     // TODO add validations
    //     if (this._players[playerId] !== undefined) {
    //         delete this._players[playerId];
    //     }
    // }

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
        let gameToRemove = this._games[gameId];
        // only delete game if it exists, it hasn't started yet, and no players are waiting for it to start
        if (gameToRemove !== undefined &&
            gameToRemove.getGameState().gameState === enums.GameState.WAITING_FOR_PLAYERS &&
            gameToRemove.getNumPlayersInGame() === 0
        ) {
            delete this._games[gameId];
        }
    }

    addPlayerToGame(gameId, player) {
        let playerAddedSuccessfully = false;
        if (player instanceof Player && this._games[gameId] !== null) {
            playerAddedSuccessfully = this._games[gameId].addPlayerToGame(player);
            this._playerToGameIdMap[player.getId()] = gameId;
        }
        return playerAddedSuccessfully;
    }
}

// singleton
let gameManager = (function () {
    let instance;

    function createInstance() {
        return new GamesManager();
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