import React from 'react';
import UsersListComponent from "./usersListComponent.jsx";
import GamesListComponent from "./gamesListComponent.jsx";
import AddGameComponent from "./addGameComponent.jsx";

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            addGameComponentIsVisible: false
        };
        this.setAddGameVisibility = this.setAddGameVisibility.bind(this);
    }

    setAddGameVisibility(isVisible) {
        this.setState({addGameComponentIsVisible: isVisible});
    }

    render() {
        return (
            <div id='games-room-container'>
                <AddGameComponent isVisible={this.state.addGameComponentIsVisible}
                                  setVisibility={this.setAddGameVisibility}/>
                <UsersListComponent userName={this.props.userName}
                                    handleLogout={this.props.handleLogout}
                />
                <GamesListComponent gameSelected={this.props.gameSelected}
                                    userName={this.props.userName}
                                    setAddGameVisibility={this.setAddGameVisibility}/>
            </div>
        )
    }
}


