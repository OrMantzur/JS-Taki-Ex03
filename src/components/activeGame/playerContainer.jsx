/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";
import CardContainer from "./cardContainer.jsx";
import {GameState, SpecialCard} from "../../server/logic/enums";

export default class PlayerContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            colorPickerVisible: false,
            changeColorCardSelected: null
        };
        this.cardClicked = this.cardClicked.bind(this);
        this.colorPickerClickedCard = this.colorPickerClickedCard.bind(this);
    }

    cardClicked(i_Card, additionalData) {
        let body = {cardClicked: i_Card, additionalData: additionalData};
        let currGameState = this.props.currentGameState;
        if (i_Card._value === SpecialCard.CHANGE_COLOR && currGameState !== GameState.OPEN_TAKI && currGameState !== GameState.OPEN_PLUS_2) {
            if (this.state.colorPickerVisible === false) {
                this.setState({
                    colorPickerVisible: true,
                    changeColorCardSelected: i_Card
                });
            } else {
                fetch('/activeGame/makeMove', {method: 'post', body: JSON.stringify(body), credentials: 'include'})
                    .then(() => this.props.movePlayed());
            }
        }
        else {
            if (i_Card._value === SpecialCard.SUPER_TAKI)
                additionalData = this.state.topCardOnTable._color;
            fetch('/activeGame/makeMove', {method: 'post', body: JSON.stringify(body), credentials: 'include'})
                .then(() => this.props.movePlayed());
        }
        // //TODO should we check if the move was played successfully?
        // this.props.movePlayed();
    }

    colorPickerClickedCard(color) {
        this.setState({colorPickerVisible: false, changeColorCardSelected: null});
        this.cardClicked(this.state.changeColorCardSelected, color);
    }

    getDisplayOverlayText() {
        let overlayDisplayText = "";
        if (this.props.gameControlsLocked)
            overlayDisplayText = "Please wait for your turn";
        else if (this.props.currentGameState.gameState === GameState.GAME_ENDED)
            overlayDisplayText = "Game ended";

        return overlayDisplayText;
    }

    displayOverlay() {
        if (this.props.gameControlsLocked || this.props.currentGameState.gameState === GameState.GAME_ENDED) {
            return displayOverlayStyle;
        }
        else
            return null;
    }

    render() {
        if (!this.props.cards)
            return null;

        return (
            <div id="player-container">
                {this.props.cards.map((card) => (
                    <CardContainer card={card} key={card._id} cardClicked={this.cardClicked}/>))}
                <div id="player-overlay" className="screen-overlay" style={this.displayOverlay()}>
                    <h1>{this.getDisplayOverlayText()}</h1></div>
                <div id="colorPicker" className="screen-overlay"
                     style={this.state.colorPickerVisible ? displayOverlayStyle : null}>
                    <h2>Please choose a color: </h2>
                    <div className="card red clickable-card"
                         onClick={this.colorPickerClickedCard.bind(this, 'red')}/>
                    <div className="card green clickable-card"
                         onClick={this.colorPickerClickedCard.bind(this, 'green')}/>
                    <div className="card blue clickable-card"
                         onClick={this.colorPickerClickedCard.bind(this, 'blue')}/>
                    <div className="card yellow clickable-card"
                         onClick={this.colorPickerClickedCard.bind(this, 'yellow')}/>
                </div>
            </div>
        );
    };
}

const displayOverlayStyle = {
    display: "flex"
};