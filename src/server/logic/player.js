/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const SpecialCard = require("./card").SpecialCard;

/**
 * can be human/computer player
 *
 * @param i_PlayerName
 * @param i_IsComputer
 * @returns {*}
 * @constructor
 */
class Player {

    // TODO delete all computer player
    constructor(playerName, isComputer) {
        this._playerId = Player.nextFreePlayerId++;
        this._playerName = playerName;
        this._cards = [];
        this._isComputer = isComputer;
        this._isActive = false;
        this._isWinner = false;
        this._isLeave = false;
        this._currTurnStartTime = undefined;
        this._turnsPlayed = 0;
        this._totalTimePlayed = 0;
        this._timesReachedSingleCard = 0;
    }

    getId() {
        return this._playerId;
    }

    getName() {
        return this._playerName;
    }

    getCards() {
        return this._cards;
    }

    /**
     * returns a ptr to a card in the player's hand that has the given color
     */
    getCardOfColor(color) {
        return this._cards.find((card) => {
            return card.getColor() === color;
        });
    }

    /**
     * returns a ptr to a card in the player's hand that has the given value
     */
    getCardOfValue(value) {
        return this._cards.find((card) => {
            return card.getValue() === value;
        });
    }

    getCardOfColorAndValue(color, value) {
        return this._cards.find((card) => {
            return card.getValue() === value && card.getColor() === color;
        });
    }

    getCardById(cardId) {
        return this._cards.find((card) => {
            return card.getId() === parseInt(cardId);
        });
    }

    // used for debugging
    getCardsStrArr() {
        let cardsToReturn = [];
        this._cards.forEach((card) => {
            return cardsToReturn.push(card.getColor() + " " + card.getValue());
        });
        return cardsToReturn.join(", ");
    }

    getCardsRemainingNum() {
        return this._cards.length;
    }

    isComputerPlayer() {
        return this._isComputer;
    }

    isActive() {
        return this._isActive;
    }

    isWinner() {
        return this._isWinner;
    }

    isLeave() {
        return this._isLeave;
    }

    increaseTimesReachedSingleCard() {
        this._timesReachedSingleCard++;
    }

    getTotalTurnsPlayed() {
        return this._turnsPlayed;
    }

    getAverageTurnTime() {
        let totalAvgTimeInSeconds = (this._totalTimePlayed / this._turnsPlayed) / 1000;
        let avgTimeSeconds = Math.floor(totalAvgTimeInSeconds % 60);
        let avgTimeMinutes = Math.floor(totalAvgTimeInSeconds / 60);
        if (totalAvgTimeInSeconds.toString() === "NaN" || avgTimeSeconds.toString() === "NaN" ||
            avgTimeMinutes.toString() === "NaN") {
            return 0;
        }
        return (avgTimeMinutes < 10 ? "0" + avgTimeMinutes : avgTimeMinutes) + ":" + (avgTimeSeconds < 10 ? "0" + avgTimeSeconds : avgTimeSeconds);
    }

    getTimesReachedSingleCard() {
        return this._timesReachedSingleCard;
    }

    getStatistics() {
        return {
            avgTurnTime: this.getAverageTurnTime(),
            totalTurnsPlayed: this._turnsPlayed,
            timesReachedSingleCard: this._timesReachedSingleCard,
            numCardsInHand: this._cards.length
        }
    }

    /**
     * @param isValidFunc
     * @param contextFunc
     * @param ignoreSuperTaki
     * @returns {Card}
     */
    getPossibleMove(isValidFunc, contextFunc, ignoreSuperTaki = false) {
        let cardThatCanBePlaced = null;
        for (let i = 0; i < this._cards.length; i++) {
            if (isValidFunc.call(contextFunc, this._cards[i]) === true) {
                if (this._cards[i].getValue() !== SpecialCard.SUPER_TAKI || !ignoreSuperTaki) {
                    cardThatCanBePlaced = this._cards[i];
                }
                break;
            }
        }
        return cardThatCanBePlaced;
    }

    addCardsToHand(cardsToAdd) {
        if (cardsToAdd instanceof Array && cardsToAdd.length > 0) {
            this._cards = this._cards.concat(cardsToAdd);
        }
    }

    // finds the given card in the player's hand removes it from the hand and returns the card, null if the card is not found
    removeCardFromHand(cardToRemove) {
        let cardRemoved = null;
        let indexToRemove = this._cards.findIndex(function (card) {
            return card === cardToRemove;
        });
        if (indexToRemove >= 0 && indexToRemove < this._cards.length) {
            cardRemoved = this._cards.splice(indexToRemove, 1);
        }

        return cardRemoved;
    }

    removeAllCardsFromHand() {
        this._cards = [];
    }

    startTurn() {
        this._isActive = true;
        this._currTurnStartTime = new Date();
    }

    endTurn() {
        if (this._currTurnStartTime !== null) {
            this._isActive = false;
            let endTurnTime = new Date();
            this._totalTimePlayed += endTurnTime - this._currTurnStartTime;
            endTurnTime = null;
            this._currTurnStartTime = null;
            this._turnsPlayed++;
        }
    }

    win() {
        this._isWinner = true;
    }

    leave() {
        this._isLeave = true;
    }

// for testing
    printCardsInHandToConsole() {
        console.log("printing all cards in hand");
        for (let i = 0; i < this._cards.length; i++) {
            console.log(this._cards[i].getValue() + ", " + this._cards[i].getColor() + "\n");
        }
    }

}

Player.nextFreePlayerId = 0;

module.exports = Player;
