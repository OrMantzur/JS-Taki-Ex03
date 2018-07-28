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
        this._playerIdToGameIdMap = {};
        // this.getGameState = this.getGameState.bind(this);
    }

    getGame(gameId) {
        return this._games[gameId];
    }

    getGameIdByPlayerId(playerId) {
        return this._playerIdToGameIdMap[playerId];
    }

    getGameObjectByPlayerId(playerId) {
        let gameId = this._playerIdToGameIdMap[playerId];
        return this._games[gameId];
    }

    getAllGames() {
        return this._games;
    }


    addGame(gameType, playersNum, gameName, gameCreator) {
        let returnObject = {
            valid: true,
            errorMessage: undefined
        };
        // validate all values
        if (!(gameType === enums.GameType.BASIC || gameType === enums.GameType.ADVANCED) ||
            playersNum > MAX_PLAYER_PER_GAME || playersNum < MIN_PLAYER_PER_GAME ||
            !gameName || !gameCreator) {
            returnObject.valid =false;
            returnObject.errorMessage =
                "please validate that game name isn't empty\n" +
                "game type select from list\n" +
                "num player between " + MIN_PLAYER_PER_GAME + " and " + MAX_PLAYER_PER_GAME;
            return returnObject;
        }
        // check if name already exists
        for (let gameIndex in this._games) {
            if (gameName === this._games[gameIndex].getGameName()) {
                returnObject.valid= false;
                returnObject.errorMessage="name " + gameName + " already exist";
                console.log(returnObject.errorMessage);
                return returnObject;
            }
        }

        /* add game */
        let game = new Game.Game(gameType, playersNum, gameName, gameCreator);
        this._games[game.getGameId()] = game;
        return returnObject;

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
            this._playerIdToGameIdMap[player.getId()] = gameId;
        }
        return playerAddedSuccessfully;
    }

    takeCardsFromDeck(playerId) {
        let game = this.getGameObjectByPlayerId(playerId);
        return game.takeCardsFromDeck();
    }

    getGameState(playerId) {
        try {
            let game = this.getGameObjectByPlayerId(playerId);
            let userMessage = game.viewTopCardOnTable().getUserMessage();
            return {
                playerWon: game.getGameState().gameState === enums.GameState.GAME_ENDED,
                activePlayer: game.getActivePlayer(),
                regularPlayerCards: game.getFirstHumanPlayer().getCards().slice(),
                computerPlayerCards: game.getFirstComputerPlayer().getCards().slice(),
                topCardOnTable: game.viewTopCardOnTable(),
                currentGameState: game.getGameState(),
                userMessage: userMessage !== null ? userMessage : null,
                statistics: {
                    gameStatistics: game.getStatistics(),
                    regularPlayerStats: game.getFirstHumanPlayer().getStatistics(),
                    computerPlayerStats: game.getFirstComputerPlayer().getStatistics(),
                }
            };
        } catch (e) {
            throw new Error("error while trying to get game state for playerID: " + playerId + "\ninner exception: " + e);
        }
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