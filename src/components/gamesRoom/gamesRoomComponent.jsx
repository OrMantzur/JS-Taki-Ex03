import React from 'react';
import UsersListComponent from "./usersListComponent.jsx";
import GamesListComponent from "./gamesListComponent.jsx";

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div id='games-room-container'>
                <UsersListComponent userName={this.props.userName}
                                    logoutClicked={this.logout}
                />
                <GamesListComponent gameSelected={this.props.gameSelected}/>
            </div>
        )
    }



}


