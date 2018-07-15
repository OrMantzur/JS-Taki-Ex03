/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

class CardsOnTable {

    constructor() {
        this._cards = [];
    }

    getSize() {
        return this._cards.length;
    }

    putCardOnTable(card) {
        this._cards.push(card);
    }

    viewTopCard() {
        let topCard = null;
        if (this._cards.length > 0) {
            topCard = this._cards[this._cards.length - 1];
        }
        return topCard;
    }

    /**
     * used in case where cards need to be move from the table back to the deck
     * @returns {*}
     */
    takeAllButTopCard() {
        let pickedUpCards = null;
        if (this._cards.length > 0) {
            pickedUpCards = this._cards.splice(1, this._cards.length - 1);
        }
        return pickedUpCards;
    }

}

module.exports = CardsOnTable;
