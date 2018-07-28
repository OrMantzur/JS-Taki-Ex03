import React from 'react';
import UsersListComponent from "./usersListComponent.jsx";
import GamesListComponent from "./gamesListComponent.jsx";

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
        this.joinGame = this.joinGame.bind(this);
        this.logout = this.logout.bind(this);
    }

    render() {
        return (
            <div id='games-room-container'>
                <UsersListComponent userName={this.props.userName}
                                    logoutClicked={this.logout}
                />
                <GamesListComponent gameSelected={this.joinGame}                />
            </div>
        )
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


