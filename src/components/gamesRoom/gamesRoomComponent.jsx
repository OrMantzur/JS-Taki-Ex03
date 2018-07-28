import React from 'react';
import UsersListComponent from "./usersListComponent.jsx";
import GamesListComponent from "./gamesListComponent.jsx";

var enums = require('../../server/logic/enums');

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
        this.addGame = this.addGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
        this.logout = this.logout.bind(this);
    }

    render() {
        return (
            <div>
                hello {this.props.userName}

                <UsersListComponent/>
                <GamesListComponent gameSelected={this.joinGame} deleteGame={this.deleteGame}/>
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

                <form onSubmit={this.joinGame}>
                    <label className="gameId" htmlFor="gameId">gameId: </label>
                    <input className="gameId-input" name="gameId"/>
                    <input className="submit-btn btn" type="submit" value="Start Game"/>
                </form>

                <button className="logout btn" onClick={this.logout}>Logout</button>
            </div>
        )
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

    deleteGame(gameIdToDelete) {
        let body = {gameId: gameIdToDelete};
        // delete game
        fetch('/games/deleteGame', {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw Error(text)
                });
            }
            console.log("gameId " + gameIdToDelete + " delete successfully");
        }).catch(errorMessage => {
            alert(errorMessage);
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
