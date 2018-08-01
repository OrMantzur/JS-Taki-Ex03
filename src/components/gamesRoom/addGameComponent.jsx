/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from 'react';

const enums = require('../../server/logic/enums');
const displayAddGameStyle = {display: "flex"};

export default class AddGameComponent extends React.Component {

    constructor() {
        super();
        this.addGame = this.addGame.bind(this);
    }

    addGame(formEvent) {
        formEvent.preventDefault();
        const body = {
            gameTitle: formEvent.target.elements.gameTitle.value,
            gameType: formEvent.target.elements.gameType.value,
            numPlayers: formEvent.target.elements.numPlayers.value
        };

        fetch('/games/addGame', {method: 'POST', body: JSON.stringify(body), credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw Error(text)
                    });
                } else {
                    console.log("The Game \"" + body.gameTitle + "\" was added successfully");
                }
            })
            .then(() =>
                this.props.setVisibility(false)
            )
            .catch(errorMessage => {
                alert(errorMessage);
            });
        formEvent.target.reset();
    }


    render() {
        return (
            <div id='add-new-game-container' style={this.props.isVisible ? displayAddGameStyle : null}>
                <div id='add-new-game-form-container'>
                    <h2 className="bold"><u> Add Game </u></h2>
                    <form onSubmit={this.addGame}>
                        <label htmlFor="gameTitle"> Title: </label>
                        <input name="gameTitle" type="text" maxLength="10"/>
                        <label htmlFor="gameType"> Game type: </label>
                        <select name="gameType">
                            <option value={enums.GameType.ADVANCED}>Advanced</option>
                            <option value={enums.GameType.BASIC}>Basic</option>
                        </select>
                        <label className="numPlayers-label" htmlFor="numPlayers"> Num players: </label>
                        <input type="number" name="numPlayers" min="2" max="4" defaultValue="2"/>
                        <input className="button green" type="submit" value="Add Game"/>
                    </form>
                    <button id="cancel-btn" className="red button"
                            onClick={this.props.setVisibility.bind(this, false)}>Cancel
                    </button>
                </div>
            </div>
        )
    }
}
