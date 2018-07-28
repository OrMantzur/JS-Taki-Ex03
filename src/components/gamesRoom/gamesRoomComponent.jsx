import React from 'react';
import UsersListComponent from "./usersListComponent.jsx";
import GamesListComponent from "./gamesListComponent.jsx";

var enums = require('../../server/logic/enums');

const displayAddGameStyle = {
    display: "flex"
};

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            showAddGame: false
        };
        this.addGame = this.addGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.logout = this.logout.bind(this);
        this.displayAddGame = this.displayAddGame.bind(this);
        this.setAddGameFormVisibility = this.setAddGameFormVisibility.bind(this);
    }

    setAddGameFormVisibility(showAddGame) {
        this.setState({showAddGame: showAddGame});
    }

    render() {
        return (
            <div id='games-room-container'>
                <UsersListComponent userName={this.props.userName}
                                    logoutClicked={this.logout}
                />
                <GamesListComponent gameSelected={this.joinGame}
                                    addGameClicked={this.setAddGameFormVisibility}
                />
                <div id='add-new-game-form-container' style={this.displayAddGame()}>
                    <form onSubmit={this.addGame}>
                        <label className="gameTitle-label" htmlFor="gameTitle"> title: </label>
                        <input className="gameTitle-input" name="gameTitle"/>
                        <label className="gameType-label" htmlFor="gameType"> game type: </label>
                        <select name="gameType">
                            <option value={enums.GameType.BASIC}>Basic</option>
                            <option value={enums.GameType.ADVANCED}>Advanced</option>
                        </select>
                        <label className="numPlayers-label" htmlFor="numPlayers"> num players: </label>
                        <input type="number" name="numPlayers" min="2" max="4" defaultValue="2"/>
                        <input className="submit-btn btn" type="submit" value="Add Game"/>
                    </form>
                </div>
            </div>
        )
    }

    displayAddGame() {
        if (this.state.showAddGame) {
            return displayAddGameStyle;
        }
        else
            return null;
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
                    console.log("game " + body.gameTitle + " was added successfully");
                }
            })
            .then(() =>
                this.setAddGameFormVisibility(false)
            )
            .catch(errorMessage => {
                alert(errorMessage);
            });
        formEvent.target.reset();
    }

    joinGame(gameIdSelected) {
        let body = {gameId: gameIdSelected};
        // start game
        fetch('/games/joinGame', {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include'
        }).then(response => {
            if (response.ok) {
                this.props.gameSelected(gameIdSelected);
            }
            return response.json();
        });
    }

    logout() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    console.log(`failed to logout user ${this.state.playerName}`, response);
                }
                this.props.handleLogout();
            })
    }

}


