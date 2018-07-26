import React from 'react';
import LoginContainer from "./login/loginContainer.jsx";
import GamesRoomComponent from "./gamesRoom/gamesRoomComponent.jsx";
import ActiveGameBaseContainer from "./activeGame/activeGameBaseContainer.jsx";

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
            playerName: null,
            activeGameId: null,
        };

        this.handleSuccessLogin = this.handleSuccessLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.getPlayerNameForThisSession = this.getPlayerNameForThisSession.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.initActiveGameState = this.initActiveGameState.bind(this);
        this.initGame = this.initGame.bind(this);
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
                        playerList:
                        {/*{this.state.gameState.playersName.map((playerName, index) => (*/}
                            {/*<p key={playerName + index}>playName: {playerName.toString()}</p>))}*/}
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

    initGame() {
        this.game = new Game(GameType.ADVANCED, 2, "Taki Man", "ex2");
        this.game.setNotifyOnMakeMove(this.updateUIGameState);
        this.regularPlayer = new Player("Human player", false);
        this.computerPlayer = new Player("Computer player", true);
        this.game.addPlayerToGame(this.regularPlayer);
        this.game.addPlayerToGame(this.computerPlayer);
        this.uiGameStatesArray = [];
        console.log("Game started - top card is: ");
        this.game.viewTopCardOnTable().printCardToConsole();
        this.uiGameStatesArray.push(this.generateGameState())
    }

    logoutHandler() {
        this.getPlayerNameForThisSession();
        this.getActiveGameForThisSession();
    }

    initActiveGameState(activeGameId) {
        this.setState({activeGameId: activeGameId});
    }

}
