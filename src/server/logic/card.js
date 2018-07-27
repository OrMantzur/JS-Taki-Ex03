/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */


const SpecialCard = require("./enums").SpecialCard;

//TODO separate to module
const Color = {
    allColors: ["red", "green", "blue", "yellow"],

    getRandomColor: function () {
        let randomIndex = Math.floor((Math.random() * 10) % Object.keys(Color.allColors).length);
        return Color.allColors[randomIndex];
    }
};

class Card {

    constructor(value, color) {
        this._id = Card.nextFreeCardId++;
        this._value = value;
        this._color = color;
    }

    getId() {
        return this._id;
    }

    getValue() {
        return this._value;
    }

    getColor() {
        return this._color;
    }

    getUserMessage() {
        let message = null;
        switch (this._value) {
            case SpecialCard.PLUS_2:
                message = "Plus 2: Next player must place +2 or take cards from the deck";
                break;
            case SpecialCard.SUPER_TAKI:
                message = "Super Taki: Player may place all cards of the same color as the top card";
                break;
            case SpecialCard.CHANGE_COLOR:
                // Change color doesn't need a message because there is a color picker
                break;
            case SpecialCard.TAKI:
                message = "Taki: Player may place all cards of the same color as the taki card";
                break;
            case SpecialCard.STOP:
                message = "Stop: skipping next player's turn";
                break;
            case SpecialCard.PLUS:
                message = "Plus: Player gets another turn";
                break;
            default:
                break;
        }
        return message;
    }

    setColor(color) {
        if (this._value === SpecialCard.CHANGE_COLOR || this._value === SpecialCard.SUPER_TAKI) {
            this._color = color;
        } else {
            // throw new Error("color can only be changed for \"change color\" cards");
            console.log("card color was not changed - color can only be changed for \"change color\" and \"super taki\" cards");
        }
    }

    isSpecialCard() {
        let isSpecial = false;
        for (let specialCardKey in SpecialCard) {
            if (this._value === SpecialCard[specialCardKey]) {
                isSpecial = true;
            }
        }
        return isSpecial;
    }

    toString() {
        return "Color: " + this._color + ", Value: " + this._value;
    }

    printCardToConsole() {
        console.log(this.toString());
    }

}

Card.nextFreeCardId = 0;

module.exports = {Card, Color};
