/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";
import CardContainer from "./cardContainer.jsx";
import {SpecialCard, GameState} from "../../server/logic/enums";

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
        fetch('/activeGame/gameState', {method: 'get', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then((currGameState) => {
                if (i_Card.getValue() === SpecialCard.CHANGE_COLOR && currGameState !== GameState.OPEN_TAKI && currGameState !== GameState.OPEN_PLUS_2) {
                    if (this.state.colorPickerVisible === false) {
                        this.setState({
                            colorPickerVisible: true,
                            changeColorCardSelected: i_Card
                        });
                    } else {
                        return fetch('/activeGame/makeMove', {method: 'post', body: JSON.stringify(body), credentials: 'include'});
                    }
                }
                else {
                    if (i_Card.getValue() === SpecialCard.SUPER_TAKI)
                        additionalData = this.props.game.viewTopCardOnTable().getColor();
                    return fetch('/activeGame/makeMove', {method: 'post', body: JSON.stringify(body), credentials: 'include'});
                }
            })
            .then(() => {
                //TODO should we check if the move was played successfully?
                this.props.movePlayed();
            })
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
        return (
            <div id="player-container">
                {this.props.cards.map((card) => (
                    <CardContainer card={card} key={card.getId()} cardClicked={this.cardClicked}/>))}
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