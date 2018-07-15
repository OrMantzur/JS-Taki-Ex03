/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const Card = require("./card").Card;
const Color = require("./card").Color;
const SpecialCard = require("./card").SpecialCard;
const NUMBER_CARD = require("./card").NUMBER_CARD;
const GameType = require("./game").GameType;

/**
 * deck in BASIC game contains:
 * number card(8): 2 of each color
 * taki: 2 of each color
 * stop: 2 of each color
 * plus: 2 of each color
 * change color: 4 cards
 * there are 4 color
 * total 92 cards (8*4*2 + 4*2 + 4*2 + 4*2 + 4)
 *
 * deck in ADVANCED game contains:
 * all the basic cards and in addition:
 * plus 2: 2 of each color
 * super taki: 2 cards
 * there are 4 color
 * total 102 cards (92 + 4*2 + 2)
 *
 * @param gameType
 * @returns {{getSize: (function(): number), addCardsToDeck: addCardsToDeck, drawCards: (function(*): Array), printAllCards: printAllCards}}
 * @constructor
 */
class Deck {

    constructor(gameType) {
        this.gameType = gameType;
        this._cards = [];
        this._initNumberCards();
        this._initSpecialCards();
    }

    _initNumberCards() {
        Color.allColors.forEach((color) => {
            NUMBER_CARD.forEach((cardValue) => {
                this._cards = this._cards.concat(Deck.createCards(cardValue, color, Deck.CARD_NUMBER_OF_EACH_COLOR));
            });
        });
    }

    _initSpecialCards() {
        let specialCardValue;
        for (let specialCardKey in SpecialCard) {
            specialCardValue = SpecialCard[specialCardKey];
            // skip only when it basic game with PLUS_2 or SUPER_TAKI cards
            if (!(this.gameType === GameType.BASIC &&
                (specialCardValue === SpecialCard.PLUS_2 || specialCardValue === SpecialCard.SUPER_TAKI))) {
                let cardsToAdd;
                if (specialCardValue === SpecialCard.CHANGE_COLOR) {
                    cardsToAdd = Deck.createCards(specialCardValue, null, Deck.CHANGE_COLOR_AMOUNT);
                    this._cards = this._cards.concat(cardsToAdd);
                } else if (specialCardValue === SpecialCard.SUPER_TAKI) {
                    cardsToAdd = Deck.createCards(specialCardValue, null, Deck.SUPER_TAKI_AMOUNT);
                    this._cards = this._cards.concat(cardsToAdd);
                } else {
                    Color.allColors.forEach((color) => {
                        cardsToAdd = Deck.createCards(specialCardValue, color, Deck.CARD_NUMBER_OF_EACH_COLOR);
                        this._cards = this._cards.concat(cardsToAdd);
                    });
                }
            }
        }
    }

    _drawCard() {
        if (this._cards.length === 0) {
            console.log("Deck: Tried to draw card from an empty deck - returning null");
            return null;
        }

        let randIndex = Math.floor((Math.random() * 1000) % this._cards.length);
        return this._cards.splice(randIndex, 1)[0];
    }

    static createCards(value, color, amount) {
        let newCards = [];
        for (let i = 0; i < amount; i++) {
            newCards.push(new Card(value, color));
        }
        return newCards;
    }

    /**
     * returns the number of cards currently in the deck
     * @return {number}
     */
    getSize() {
        return this._cards.length;
    }

    /**
     * assume cardsToAdd is an array of cards
     * @param cardsToAdd
     */
    addCardsToDeck(cardsToAdd) {
        if (cardsToAdd instanceof Array && cardsToAdd.length > 0) {
            this._cards = this._cards.concat(cardsToAdd);
        } else {
            console.log("Error in 'addCardsToDeck', parameter must be an array");
        }
    }

    /**
     *  draw and remove a random card from the deck
     * @param i_numCards
     * @returns {Array}
     */
    drawCards(i_numCards) {
        let cardsDrawn = [];
        for (let i = 0; i < i_numCards; i++) {
            cardsDrawn.push(this._drawCard());
        }
        return cardsDrawn;
    }

    //for testing
    printAllCards() {
        let arr = [];
        this._cards.forEach((card) => {
            arr.push(card.getColor() + ", " + card.getValue());
        });
        console.log(arr.join("\n"));
    }

}

Deck.CARD_NUMBER_OF_EACH_COLOR = 2;
Deck.CHANGE_COLOR_AMOUNT = 4;
Deck.SUPER_TAKI_AMOUNT = 2;

module.exports = Deck;
