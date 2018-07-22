import React from 'react';
import UsersListComponent from "./usersListComponent.jsx";
import GamesListComponent from "./gamesListComponent.jsx";

var enums = require('../../server/logic/enums');
var bodyParser = require('body-parser');

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
        this.addGame = this.addGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.logout = this.logout.bind(this);
    }

    render() {
        return (
            <div>
                hello {this.props.userName}

                {/*TODO delete */}
                <UsersListComponent/>
                <GamesListComponent/>
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

                {/*<form method="POST">*/}
                {/*<input type="text"/>*/}
                {/*<input type="submit" className="addGame btn" onClick={this.addGame}>Add Game</input>*/}
                {/*</form>*/}

                <form onSubmit={this.startGame}>
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
                if (response.ok) {
                    this.setState(() => ({errMessage: ""}));
                    alert("Game added");
                    return true;
                } else {
                    if (response.status === 403) {
                        alert("Error - game was not added");
                    }
                    return false;
                }
            }).then(gameAdded => {
            if (gameAdded)
                formEvent.target.reset();
        });
    }

    // getAllGames() {
    //     // TODO
    //     return null;
    // }

    startGame(formEvent) {
        formEvent.preventDefault();
        let gameIdToStart = formEvent.target.elements.gameId.value;

        // start game
        let activeGame = fetch('/games/startGame', {
            method: 'POST',
            body: JSON.stringify({gameId: gameIdToStart}),
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(activeGame => {
            // render base container to active game component
            this.props.initActiveGameState(activeGame);
        });
    }

    logout() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    console.log(`failed to logout user ${this.state.userName}`, response);
                }
                this.props.initLoginState();
            })
    }

}
