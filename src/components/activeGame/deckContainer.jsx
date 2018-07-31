/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";

export default class DeckContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.clickedDeck = this.clickedDeck.bind(this);
    }

    clickedDeck() {
        if (this.props.deckDisabled)
            return;
        fetch('/activeGame/clickedDeck', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then((cardsTakenFromDeck) => {
                if (cardsTakenFromDeck.length === 0) {
                    let cardThatCanBePlaced = this.props.possibleMoveForActivePlayer;
                    const msg = "Cannot take card from the deck when there is a possible move to play\nYou can try placing '" + cardThatCanBePlaced._value + " " + (cardThatCanBePlaced._color !== null ? cardThatCanBePlaced._color : "") + "'";
                    alert(msg);
                } else {
                    this.props.pickedUpCardFromDeck();
                }
            })
            .catch(err => {
                throw err
            });
    }

    generateClassName() {
        let classNames = ['card', 'backOfCard', 'deckCard'];
        if (this.props.highlightDeck)
            classNames.push('highlightDeck');
        if (!this.props.deckDisabled)
            classNames.push('clickable-card');

        return classNames.join(' ')
    }

    render() {
        const deckStyle = {
            margin: '0 0 0 15vw'
        };

        return (
            <div align="center" style={deckStyle}>
                <div id="deck"
                     className={this.generateClassName()}
                     onClick={this.clickedDeck}/>
            </div>
        );
    };
}