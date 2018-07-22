import React from 'react';
import LoginContainer from "./login/loginContainer.jsx";
import GamesRoomComponent from "./gamesRoom/gamesRoomComponent.jsx";
const Game = require("../server/logic/game.js").Game;

const DisplayScreen = {
    LOGIN: "login",
    GAMES_ROOM: "GamesRoom",
    ACTIVE_GAME: "ActiveGame"
};

/**
 * kind of entry point of all components
 */
export default class BaseContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            displayedScreen: DisplayScreen.LOGIN,
            userName: "",
            activeGame: null
        };

        this.handleSuccessLogin = this.handleSuccessLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.initLoginState = this.initLoginState.bind(this);
        this.initActiveGameState = this.initActiveGameState.bind(this);
    }

    render() {
        switch (this.state.displayedScreen) {
            case DisplayScreen.GAMES_ROOM:
                return (
                    <GamesRoomComponent userName={this.state.userName}
                                        initLoginState={this.initLoginState}
                                        initActiveGameState={this.initActiveGameState}/>
                );
            case DisplayScreen.ACTIVE_GAME:
                return (
                    <h1>Active Game id {this.state.activeGame.getGameId()}</h1>
                );
            case DisplayScreen.LOGIN:
            default:
                return (
                    <LoginContainer loginSuccessHandler={this.handleSuccessLogin}
                                    loginErrorHandler={this.handleLoginError}/>
                );
        }
    }

    handleSuccessLogin() {
        this.setState(() => ({displayedScreen: DisplayScreen.GAMES_ROOM}), this.setUserName);
    }

    handleLoginError() {
        this.setState(() => ({displayedScreen: DisplayScreen.LOGIN}));
    }

    setUserName() {
        fetch('/users/activeUserName', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(userName => {
                this.setState(() => ({displayedScreen: DisplayScreen.GAMES_ROOM, userName: userName}));
            })
            .catch(err => {
                // in case we're getting unauthorized
                if (err.status === 401) {
                    this.setState(() => ({displayedScreen: DisplayScreen.LOGIN}));
                } else {
                    throw err;
                }
            });
    }

    initLoginState() {
        this.setState(() => ({displayedScreen: DisplayScreen.LOGIN, userName: ""}));
    }

    initActiveGameState(activeGame) {
        this.setState(() => ({displayedScreen: DisplayScreen.ACTIVE_GAME, activeGame: activeGame}));
    }

}
