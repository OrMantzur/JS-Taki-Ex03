/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const Color = require("./card").Color;
const SpecialCard = require("./card").SpecialCard;
const CardsOnTable = require("./cardsOnTable");
const Deck = require("./deck");
const Card = require("./card").Card;
const enums = require("./enums");

const NUM_STARTING_CARDS = 8;

class Game {
    constructor(gameType, playersNum, gameName, gameCreator) {
        // TODO (advanced game) Validate in gameManager when there is more than one game
        this._gameId = Game.nextFreeGameId++;
        this._gameType = gameType;
        this._numPlayersToStartGame = playersNum;
        this._gameName = gameName;
        this._gameCreator = gameCreator;
        this._players = [];
        this._activePlayerIndex = 0;
        this._activeGame = false;
        this._deck = new Deck(gameType);
        this._cardsOnTable = new CardsOnTable();
        this._gameStartTime = null;
        this._gameEndTime = null;
        this._gameDirection = enums.Direction.RIGHT;
        this._gameState = {
            currColor: null,
            gameState: enums.GameState.WAITING_FOR_PLAYERS,
            additionalInfo: null
        };
        this._notifyOnMakeMove = null;
    }

    setNotifyOnMakeMove(callback) {
        this._notifyOnMakeMove = callback;
    }

    getGameId() {
        return this._gameId;
    }

    getGameType() {
        return this._gameType;
    }

    getNumPlayersInGame() {
        return this._players.length;
    }

    getGameName() {
        return this._gameName;
    }

    getGameCreator() {
        return this._gameCreator;
    }

    getActivePlayer() {
        return this._players[this._activePlayerIndex];
    }

    getPlayer(playerId) {
        let playerIndex = this.getPlayerIndexById(playerId);
        return this._players[playerIndex];
    }

    getPlayerNameList() {
        let playersNames = [];
        this._players.forEach(player => {
            playersNames.push(player.getName());
        });
        return playersNames;
    }

    getFirstHumanPlayer() {
        return this._players.find(player => !player.isComputerPlayer());
    }

    getFirstComputerPlayer() {
        return this._players.find(player => player.isComputerPlayer());
    }

    isActiveGame() {
        return this._activeGame;
    }

    getCardsRemainingInDeck() {
        return this._deck.getSize();
    }

    getCardsOnTableCount() {
        return this._cardsOnTable.getSize();
    }

    getOtherPlayersCards(playerId) {
        let otherPlayersCards = {};
        this._players.forEach((player) => {
            if (player.getId() !== playerId) {
                otherPlayersCards[player.getId()] = player.getCards();
            }
        });
        return otherPlayersCards;
    }

    getGameState() {
        return this._gameState;
    }

    _getGameDuration() {
        let endTime = this._gameEndTime === null ? new Date() : this._gameEndTime;
        return this._gameStartTime === null ?
            0 :
            endTime - this._gameStartTime;
    }

    getGameDuration() {
        return this._getGameDuration();
    }

    getStatistics() {
        let totalTurnsPlayed = 0;
        this._players.forEach(function (player) {
            totalTurnsPlayed += player.getTotalTurnsPlayed();
        });
        let gameDuration = this._getGameDuration();
        let minutesPlayed = Math.floor(gameDuration / (1000 * 60));
        let secondsPlayed = Math.floor(gameDuration / 1000) % 60;
        return {
            totalTurnsPlayed: totalTurnsPlayed,
            gameDuration: (minutesPlayed < 10 ? "0" + minutesPlayed : minutesPlayed) + ":" + (secondsPlayed < 10 ? "0" + secondsPlayed : secondsPlayed),
            cardsOnTable: this.getCardsOnTableCount(),
            cardsInDeck: this.getCardsRemainingInDeck(),
        };
    }

    getAllPlayersStatistics(){
        let playerStatistics = {};
        this._players.forEach((player) => {
            playerStatistics[player.getId()] = player.getStatistics();
        });
        return playerStatistics;
    }

    isGameStart(){
        return this._gameState.gameState &&this._gameState.gameState !== enums.GameState.WAITING_FOR_PLAYERS;
    }

    addPlayerToGame(playerToAdd) {
        let playerAddedSuccessfully = false;
        if (this._active || this._players.length >= this._numPlayersToStartGame) {
            console.log("Cannot add another player, game is full or has already started");
        } else {
            this._players.push(playerToAdd);
            playerToAdd.addCardsToHand(this._deck.drawCards(NUM_STARTING_CARDS));
            console.log("GameID (" + this._gameId + "): " + playerToAdd.getName() + " has joined the game");
            playerAddedSuccessfully = true;
            if (this._players.length.toString() === this._numPlayersToStartGame) {
                this._startGame();
            }
        }
        return playerAddedSuccessfully;
    }

    /**
     * game start only when there are enough players in game
     * @private
     */
    _startGame() {
        this._activeGame = true;
        console.log("GameID (" + this._gameId + "): The game has started");
        // open start card (can't start with changeColor or superTaki card)
        let cardDrawnFromDeck;
        do {
            cardDrawnFromDeck = this._deck.drawCards(1)[0];
        } while (cardDrawnFromDeck.getValue() === enums.SpecialCard.CHANGE_COLOR || cardDrawnFromDeck.getValue() === enums.SpecialCard.SUPER_TAKI || cardDrawnFromDeck.getValue() === enums.SpecialCard.PLUS_2);

        this._cardsOnTable.putCardOnTable(cardDrawnFromDeck);
        this._players[this._activePlayerIndex].startTurn();
        this._gameStartTime = new Date();
        this._gameState.gameState = enums.GameState.GAME_STARTED;
    }

    _moveCardsFromTableToDeck() {
        let pickedUpCards = this._cardsOnTable.takeAllButTopCard();
        this._deck.addCardsToDeck(pickedUpCards);
    }

    /**
     *
     * @param cardPlaced
     * @param additionalData - additional info such as color for "change color" card
     * @returns {boolean} - true if move was successful else false
     */
    makeMove(cardPlaced, additionalData) {
        // first, check move validation
        if (!this._isValidMove(cardPlaced)) {
            console.log("Invalid move!");
            return false;
        }

        // the move
        // var cardValue = cardPlaced.getValue();
        let activePlayer = this._players[this._activePlayerIndex];
        activePlayer.removeCardFromHand(cardPlaced);
        this._cardsOnTable.putCardOnTable(cardPlaced);

        if (activePlayer.getCardsRemainingNum() === 1) {
            activePlayer.increaseTimesReachedSingleCard();
        } else if (this._checkIfActivePlayerWon()) {
            return true;
        }

        // check if after the move there are more valid moves
        if (this._gameState.gameState === enums.GameState.OPEN_TAKI &&
            activePlayer.getCardOfColor(cardPlaced._color) !== undefined &&
            // in order to set the color of super taki in _afterMoveOfSpecialCard()
            cardPlaced._value !== enums.SpecialCard.SUPER_TAKI) {
            // taki open + player has more cards of the same color = player gets another turn;
        } else {
            if (this._gameState.gameState === enums.GameState.OPEN_TAKI) {
                // taki open + player has no more cards of the same color = return to normal state
                this._gameState.gameState = undefined;
                this._gameState.additionalInfo = null;
            }
            if (Card.isSpecialCard(cardPlaced._value)) {
                // make changes to game state according to placed card
                this._afterMoveOfSpecialCard(cardPlaced, additionalData);
            } else {
                this._gameState.gameState = undefined;
                this._gameState.additionalInfo = null;
                this._moveToNextPlayer();
            }
        }

        // for debugging
        console.log("Player \"" + activePlayer.getName() + "\" placed the following card on the table:");
        let cardCopy = new Card(cardPlaced._value, cardPlaced._color);
        cardCopy.printCardToConsole();
        // this._notifyOnMakeMove();
        return true;
    }

    _isValidMove(cardPlaced) {
        let isValid = true;
        let topCardOnTable = this._cardsOnTable.viewTopCard();
        if (topCardOnTable === null) {
            isValid = false;
        } else if (this._gameState.gameState === enums.GameState.OPEN_TAKI) {
            isValid = topCardOnTable._color === cardPlaced._color || cardPlaced._value === enums.SpecialCard.SUPER_TAKI;
        } else if (cardPlaced._value === enums.SpecialCard.CHANGE_COLOR && this._gameState.gameState !== enums.GameState.OPEN_PLUS_2) {
            // do nothing
        } else if (this._gameState.gameState === enums.GameState.OPEN_PLUS_2) {
            isValid = cardPlaced._value === enums.SpecialCard.PLUS_2;
        } else {
            isValid = topCardOnTable._color === cardPlaced._color || topCardOnTable._value === cardPlaced._value || cardPlaced._value === enums.SpecialCard.CHANGE_COLOR || cardPlaced._value === enums.SpecialCard.SUPER_TAKI;
        }

        return isValid;
    }

    _checkIfActivePlayerWon() {
        let playerWon = false;
        let activePlayer = this._players[this._activePlayerIndex];
        // check if the active player win
        if (activePlayer.getCardsRemainingNum() === 0 && !this.needToTakeCardFromDeck()) {
            playerWon = true;
            activePlayer.win();
            console.log("Player \"" + activePlayer.getName() + "\" has won!");
            this._gameEnded(activePlayer);
        }
        return playerWon;
    }

    _afterMoveOfSpecialCard(card, additionalData) {
        let cardValue = card._value;
        switch (cardValue) {
            case enums.SpecialCard.STOP:
                // two calls to skip the next player
                let skipOnePlayer = true;
                this._moveToNextPlayer(skipOnePlayer);
                console.log("in case - Stop");
                break;
            case enums.SpecialCard.SUPER_TAKI:
                card._color = additionalData;
            case enums.SpecialCard.TAKI:
                // if the player put down a "taki" card and has more cards to put then set state to "openTaki"
                if (this._players[this._activePlayerIndex].getCardOfColor(card._color) !== undefined) {
                    this._gameState.gameState = enums.GameState.OPEN_TAKI;
                } else {
                    // the player doesn't have more cards to place, so no need to change state to "openTaki"
                    this._gameState.gameState = undefined;
                    this._moveToNextPlayer();
                }
                console.log("in case - Taki");
                break;
            case enums.SpecialCard.CHANGE_COLOR:
                if (additionalData === undefined) {
                    additionalData = Color.getRandomColor();
                }
                card._color = additionalData;
                console.log("change color to " + additionalData);
                this._moveToNextPlayer();
                console.log("in case - Change Color");
                break;
            case enums.SpecialCard.PLUS_2:
                if (this._gameState.gameState === enums.GameState.OPEN_PLUS_2)
                    this._gameState.additionalInfo += 2;
                else {
                    this._gameState.gameState = enums.GameState.OPEN_PLUS_2;
                    this._gameState.additionalInfo = 2;
                }
                this._moveToNextPlayer();
                console.log("in case - PLUS_2");
                break;
            case enums.SpecialCard.PLUS:
                // do nothing, the player gets another turn
                console.log("in case - PLUS");
                break;
            case enums.SpecialCard.CHANGE_DIRECTION:
                this.switchGameDirection();
                this._moveToNextPlayer();
                console.log("in case - CHANGE_DIRECTION");
                break;
            default:
                console.log("Error - no matching special card found");
        }
    }

    /**
     *
     * @param skipOnePlayer - if true will skip the next player
     * @param {enums.Direction} direction to move (left or right - using enum)
     */
    // TODO debug and verify this works in both directions with and without skipping
    _moveToNextPlayer(skipOnePlayer) {
        this._players[this._activePlayerIndex].endTurn();
        let newIndex = this._activePlayerIndex + (this._gameDirection * (skipOnePlayer === true ? 2 : 1));
        if (newIndex < 0)
            newIndex += this._players.length;
        this._activePlayerIndex = newIndex % this._players.length;
        this._players[this._activePlayerIndex].startTurn();
    }

    getPossibleMoveForActivePlayer(ignoreSuperTaki = false) {
        return this._players[this._activePlayerIndex].getPossibleMove(this._isValidMove, this, ignoreSuperTaki);
    }

    viewTopCardOnTable() {
        return this._cardsOnTable.viewTopCard();
    }

    takeCardsFromDeck() {
        let cardsTaken = [];
        // check if there is a possible move that the player can make
        let card = this._players[this._activePlayerIndex].getPossibleMove(this._isValidMove, this, true);
        if (card !== null) {


            console.log("Cannot take card from deck when there is a possible move. \nThe card that can be places is: " + card.getColor() + ", " + card.getValue());
            return cardsTaken;
        }

        // check that there are enough cards in the deck, if not add the cards from the table to the deck so the deck won't remain empty
        if ((this._deck.getSize() <= 1) ||
            (this._gameState.gameState === enums.GameState.OPEN_PLUS_2 && this._deck.getSize() <= this._gameState.additionalInfo + 1)) {
            this._moveCardsFromTableToDeck();
        }

        let numCardsToTake = 1;
        if (this._gameState.gameState === enums.GameState.OPEN_PLUS_2) {
            numCardsToTake = this._gameState.additionalInfo;
            cardsTaken = this._deck.drawCards(numCardsToTake);
            this._gameState.gameState = undefined;
            this._gameState.additionalInfo = null;
        } else {
            cardsTaken = this._deck.drawCards(1);
        }

        let activePlayer = this._players[this._activePlayerIndex];
        console.log("player: " + activePlayer.getName() + " took " + numCardsToTake + " cards from the deck");
        activePlayer.addCardsToHand(cardsTaken);
        this._moveToNextPlayer();
        // this._notifyOnMakeMove();
        return cardsTaken;
    }

    switchGameDirection() {
        this._gameDirection = this._gameDirection === enums.Direction.RIGHT ? enums.Direction.LEFT : enums.Direction.RIGHT;
    }

    /**
     * call only at the end of move
     * @returns {boolean}
     */
    needToTakeCardFromDeck() {
        return this._cardsOnTable.viewTopCard()._value === enums.SpecialCard.PLUS;
    }

    // makeComputerPlayerMove() {
    //     let activePlayer = this._players[this._activePlayerIndex];
    //     let topCard = this._cardsOnTable.viewTopCard();
    //     let cardToPlace;
    //     let additionalData;
    //     let chooseCardToPlaceFunc = [() => {
    //         // anyColorPlus2card
    //         cardToPlace = this._gameState.gameState === GameState.OPEN_PLUS_2 ? activePlayer.getCardOfValue(SpecialCard.PLUS_2) : undefined;
    //     }, () => {
    //         // sameColorPlus2card
    //         cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.PLUS_2);
    //     }, () => {
    //         // changeColorCard
    //         cardToPlace = activePlayer.getCardOfValue(SpecialCard.CHANGE_COLOR);
    //         if (cardToPlace !== undefined) {
    //             let i;
    //             for (i = 0; Color.allColors[i] !== undefined; i++) {
    //                 if (activePlayer.getCardOfColor(Color.allColors[i]) !== undefined) {
    //                     break;
    //                 }
    //             }
    //             additionalData = Color.allColors[i] !== undefined ? Color.allColors[i] : Color.getRandomColor();
    //         }
    //     }, () => {
    //         // sameColorStopCard
    //         cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.STOP);
    //     }, () => {
    //         // sameColorPlusCard
    //         cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.PLUS);
    //     }, () => {
    //         // superTakiCard
    //         cardToPlace = activePlayer.getCardOfValue(SpecialCard.SUPER_TAKI);
    //         additionalData = topCard.getColor();
    //     }, () => {
    //         // sameColorTakiCard
    //         cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.TAKI);
    //     }, () => {
    //         cardToPlace = activePlayer.getCardOfColor(topCard.getColor());
    //     }, () => {
    //         if (this._gameState.gameState !== GameState.OPEN_TAKI) {
    //             cardToPlace = activePlayer.getCardOfValue(topCard.getValue());
    //         }
    //     }];
    //
    //     // iterate through all function until a card is found, if not then draw a card from th deck
    //     for (let i = 0; i < chooseCardToPlaceFunc.length && cardToPlace === undefined; i++) {
    //         chooseCardToPlaceFunc[i]();
    //     }
    //
    //     if (cardToPlace !== undefined && this._gameState.gameState === GameState.OPEN_PLUS_2 && cardToPlace.getValue() !== SpecialCard.PLUS_2)
    //         cardToPlace = undefined;
    //
    //     return cardToPlace === undefined ? this.takeCardsFromDeck().length > 0 : this.makeMove(cardToPlace, additionalData);
    // }

    _gameEnded(playerWhoWon) {
        this._active = false;
        this._gameState.gameState = enums.GameState.GAME_ENDED;
        this._gameState.additionalInfo = playerWhoWon;
        this._gameEndTime = new Date();
        console.log("game ended");
    }

    //TODO debug and make sure this works
    removePlayerFromGame(playerId) {
        let playerIndex = this.getPlayerIndexById(playerId);

        if (playerIndex < 0 || this._gameState.gameState !== enums.GameState.WAITING_FOR_PLAYERS) {
            console.log("error while trying to remove playerId " + playerId + " from gameId " + this._gameId + " \n.Player isn't in the game/less than two players are active/game has already started");
            return false;
        }

        let playerRemoved = this._players.splice(playerIndex, 1);
        playerRemoved.leave();
        console.log("player " + playerRemoved.getName() + " has left the game");
        // this._notifyOnMakeMove();
    }

    getPlayerIndexById(playerId) {
        let index = 0;
        let playerIndex = -1;
        this._players.forEach((player) => {
            if (player.getId() === playerId) {
                playerIndex = index;
            }
            index++;
        });
        return playerIndex;
    }

    // makeComputerMove() {
    //     return this.makeComputerPlayerMove.bind(this).apply();
    // }

}

Game.nextFreeGameId = 1;

module.exports = {Game};
