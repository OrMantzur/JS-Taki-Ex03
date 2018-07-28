import React from 'react';
import LoginContainer from "./login/loginContainer.jsx";
import GamesRoomComponent from "./gamesRoom/gamesRoomComponent.jsx";
import ActiveGameBaseContainer from "./activeGame/activeGameBaseContainer.jsx";

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
            playerName: null,
            activeGameId: null,
        };

        this.handleSuccessLogin = this.handleSuccessLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.getPlayerNameForThisSession = this.getPlayerNameForThisSession.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.initActiveGameState = this.initActiveGameState.bind(this);
        this.gameSelectedHandler = this.gameSelectedHandler.bind(this);
        this.getActiveGameForThisSession = this.getActiveGameForThisSession.bind(this);
        this.getPlayerNameForThisSession();
        this.getActiveGameForThisSession();
    }

    render() {
        if (this.state.playerName === null) {
            return (
                <LoginContainer loginSuccessHandler={this.handleSuccessLogin}
                                loginErrorHandler={this.handleLoginError}/>
            );
        }
        else if (this.state.activeGameId === null) {
            return (
                <GamesRoomComponent userName={this.state.playerName}
                                    handleLogout={this.logoutHandler}
                                    gameSelected={this.gameSelectedHandler}
                                    initActiveGameState={this.initActiveGameState}/>
            );
        }
        else {
            return (
                <div>
                    <h1>Active Game ID: {this.state.activeGameId}</h1>
                    <div>
                        <ActiveGameBaseContainer gameId={this.state.activeGameId}
                                                 playerName={this.state.playerName}
                        />
                    </div>
                </div>
            );
        }
    }

    // ================================================================================================
    // ======================================== Player Methods ========================================
    // ================================================================================================
    handleSuccessLogin() {
        this.getPlayerNameForThisSession();
    }

    handleLoginError() {
        this.setState({playerName: null});
    }

    getPlayerNameForThisSession() {
        fetch('/users/activePlayer', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(activePlayer => {
                // let playerName = activePlayer ? activePlayer._playerName : null;
                this.setState({playerName: activePlayer._playerName});
            })
            .catch(err => {
                // in case we're getting unauthorized
                if (err.status === 401 || err.status === 403) {
                    this.setState({playerName: null});
                    return null
                } else {
                    throw err;
                }
            });
    }

    // ================================================================================================
    // ========================================= Game Methods =========================================
    // ================================================================================================
    gameSelectedHandler(selectedGameId){
        this.setState({activeGameId: selectedGameId});
    }

    getActiveGameForThisSession(){
        fetch('/games/activeGameId', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(response => {
                let activeGameId = response.activeGameId;
                this.setState({activeGameId: activeGameId ? activeGameId : null});
            })
            .catch(err => {
                // in case we're getting unauthorized
                if (err.status === 401 || err.status === 403) {
                    this.setState({activeGameId: null});
                    return null
                } else {
                    throw err;
                }
            });
    }

    // ================================================================================================
    // ====================================== ActiveGame Methods ======================================
    // ================================================================================================
    logoutHandler() {
        this.getPlayerNameForThisSession();
        this.getActiveGameForThisSession();
    }

    initActiveGameState(activeGameId) {
        this.setState({activeGameId: activeGameId});
    }

}
