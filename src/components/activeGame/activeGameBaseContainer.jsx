/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from 'react';
import PlayingTableContainer from "./playingTableContainer.jsx";
import PlayerContainer from "./playerContainer.jsx";
import StatisticsContainer from "./statisticsContainer.jsx";
import PlayerWonContainer from "./playerWonContainer.jsx";
import * as enums from "../../server/logic/enums";
import ChatContainer from './chat/chatContainer.jsx';

const GAME_STATE_REFRESH_INTERVAL = 0.5 * 1000;

export default class ActiveGameBaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {};
        this.restartGame = this.restartGame.bind(this);
        this.callSetState = this.callSetState.bind(this);
        this.exitGameClicked = this.exitGameClicked.bind(this);
        this.updateUIGameState = this.updateUIGameState.bind(this);
    }

    /**
     * This method is called once all our children Elements
     * and our Component instances are mounted onto the Native UI
     */
    componentDidMount() {
        this.updateUIGameState();
    }

    updateUIGameState() {
        if (this.state.playerWon === true)
            return;

        fetch('/activeGame/gameState', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.updateUIGameState, GAME_STATE_REFRESH_INTERVAL);
                return response.json();
            })
            .then(gameState => {
                this.callSetState(gameState);
            })
            .catch(err => {
                throw err
            });
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    callSetState(gameStateUI) {
        this.setState({
            loggedInPlayer: gameStateUI.loggedInPlayer,
            playerWon: gameStateUI.playerWon,
            activePlayer: gameStateUI.activePlayer,
            playerCards: gameStateUI.playerCards,
            otherPlayersCards: gameStateUI.otherPlayersCards,
            topCardOnTable: gameStateUI.topCardOnTable,
            currentGameState: gameStateUI.currentGameState,
            userMessage: gameStateUI.userMessage,
            gameControlsLocked: gameStateUI.gameControlsLocked,
            possibleMoveForActivePlayer: gameStateUI.possibleMoveForActivePlayer,
            statistics: {
                gameStatistics: gameStateUI.statistics.gameStatistics,
                regularPlayerStats: gameStateUI.statistics.regularPlayerStats,
                allPlayerStats: gameStateUI.statistics.allPlayerStats,
            }
        });
    }

    restartGame() {
        this.updateUIGameState();
    }

    exitGameClicked() {
        fetch('/activeGame/exitGame', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                } else {
                    // pass to game room
                    this.props.exitGame();
                }
            })
            .catch(err => {
                console.log("error while trying to exit the game");
            });
    }

    render() {
        const imgStyle = {
            width: 'fit-content',
            height: 'fit-content',
            alignSelf: 'center'
        };
        if (!this.state)
            return <div><h1>gameState has not bee set yet</h1></div>;

        return (
            <div id="active-game-container">
                <div id="play-area-div">
                    <div id="player-and-table-container">
                        <PlayingTableContainer topCardOnTable={this.state.topCardOnTable}
                                               pickedUpCardFromDeck={this.updateUIGameState}
                                               deckDisabled={this.state.gameControlsLocked}
                                               highlightDeck={this.state.possibleMoveForActivePlayer === null && !this.state.gameControlsLocked}
                                               userMessage={this.state.userMessage}
                                               possibleMoveForActivePlayer={this.state.possibleMoveForActivePlayer}
                        />
                        <PlayerWonContainer playerWon={this.state.playerWon}
                                            loggedInPlayer={this.state.loggedInPlayer}
                                            gameState={this.state.currentGameState}
                                            statistics={this.state.statistics}
                                            endGame={this.exitGameClicked}
                        />
                    </div>
                    <PlayerContainer gameControlsLocked={this.state.gameControlsLocked}
                                     loggedInPlayer={this.state.loggedInPlayer}
                                     topCardOnTable={this.state.topCardOnTable}
                                     currentGameState={this.state.currentGameState}
                                     cards={this.state.playerCards}
                                     movePlayed={this.updateUIGameState}/>
                </div>

                <div id="statistics-div">
                    <img src="/images/taki-logo" alt="Taki Logo" style={imgStyle}/>
                    <StatisticsContainer statistics={this.state.statistics}
                                         loggedInPlayer={this.state.loggedInPlayer}
                                         gameControlsLocked={this.state.gameControlsLocked}
                                         activePlayer={this.state.activePlayer}
                                         currentGameState={this.state.currentGameState}
                                         exitGame={this.exitGameClicked}
                                         gameEnded={this.state.currentGameState && this.state.currentGameState.gameState === enums.GameState.GAME_ENDED}
                    />
                    <ChatContainer/>
                </div>
                <div>
                </div>


            </div>
        );
    }

}