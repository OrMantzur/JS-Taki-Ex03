import React from 'react';
import UsersListComponent from "./usersListComponent.jsx";
import GamesListComponent from "./gamesListComponent.jsx";
var enums = require('../../server/logic/enums');
var bodyParser = require('body-parser');

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.addGame = this.addGame.bind(this);
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

                <button className="logout btn" onClick={this.logout}>Logout</button>
            </div>
        )
    }

    getAllGames() {
        return
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

    addGame(e) {
        // fetch('/games/addGame', {method: 'POST', credentials: 'include'})
        //     .then(response => {
        //         if (!response.ok) {
        //             console.log(`failed to logout user ${this.state.userName}`, response);
        //         }
        //     })

        e.preventDefault();
        const body = {
            gameTitle: e.target.elements.gameTitle.value,
            gameType: e.target.elements.gameType.value,
            numPlayers: e.target.elements.numPlayers.value
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
                    e.target.reset();
        });
        // return false;
    }
}
