/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
import React from 'react';
import Game, {GameState, GameType} from "../../server/logic/game";
import Player from "../../server/logic/player";
import PlayingTableContainer from "./playingTableContainer.jsx";
import PlayerContainer from "./playerContainer.jsx";
import StatisticsContainer from "./statisticsContainer.jsx";
import ComputerPlayerContainer from "./computerPlayerContainer.jsx";
import takiLogo from "../../server/takiImages/TAKI_logo.png";
import PlayerWonContainer from "./playerWonContainer.jsx";

const COMPUTER_DELAY = 1.5 * 1000;

export default class ActiveGameBaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.generateGameState = this.generateGameState.bind(this);
        this.updateUIGameState = this.updateUIGameState.bind(this);
        this.initGame();
        this.state = this.generateGameState();
        // this.computerPlayPromise = function () {
        //     return new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             if (this.game.makeComputerMove.bind(this.game).apply()) {
        //                 resolve('the function resolved');
        //             } else {
        //                 reject('the function rejected');
        //             }
        //         }, COMPUTER_DELAY);
        //     });
        // };

        this.movePlayed = this.movePlayed.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.callSetState = this.callSetState.bind(this);
        this.exitGameClicked = this.exitGameClicked.bind(this);
        this.replayNext = this.replayNext.bind(this);
        this.replayPause = this.replayPause.bind(this);
        this.replayPrev = this.replayPrev.bind(this);
        this.replayResumeGame = this.replayResumeGame.bind(this);
        this.replayControls = {
            next: this.replayNext,
            prev: this.replayPrev,
            pause: this.replayPause,
            resume: this.replayResumeGame
        };
    }

    generateGameState() {
        let userMessage = this.game.viewTopCardOnTable().getUserMessage();
        return {
            playerWon: this.game.getGameState().gameState === GameState.GAME_ENDED,
            activePlayer: this.game.getActivePlayer(),
            regularPlayerCards: this.game.getFirstHumanPlayer().getCards().slice(),
            computerPlayerCards: this.game.getFirstComputerPlayer().getCards().slice(),
            topCardOnTable: this.game.viewTopCardOnTable(),
            currentGameState: this.game.getGameState(),
            userMessage: userMessage !== null ? userMessage : null,
            statistics: {
                gameStatistics: this.game.getStatistics(),
                regularPlayerStats: this.game.getFirstHumanPlayer().getStatistics(),
                computerPlayerStats: this.game.getFirstComputerPlayer().getStatistics(),
            }
        };
    }

    updateUIGameState() {
        let gameStateUI = this.generateGameState();
        this.uiGameStatesArray.push(gameStateUI);
        this.callSetState(gameStateUI);
    }

    callSetState(gameStateUI) {
        this.setState({
            playerWon: gameStateUI.playerWon,
            activePlayer: gameStateUI.activePlayer,
            regularPlayerCards: gameStateUI.regularPlayerCards,
            computerPlayerCards: gameStateUI.computerPlayerCards,
            topCardOnTable: gameStateUI.topCardOnTable,
            currentGameState: gameStateUI.currentGameState,
            userMessage: gameStateUI.userMessage,
            statistics: {
                gameStatistics: gameStateUI.statistics.gameStatistics,
                regularPlayerStats: gameStateUI.statistics.regularPlayerStats,
                computerPlayerStats: gameStateUI.statistics.computerPlayerStats,
            }
        });
    }

    restartGame() {
        this.initGame();
        this.uiGameStatesArray = [];
        this.updateUIGameState();
        this.setState({inReplayMode: false});
    }

    movePlayed() {
        if (this.game.getGameState().gameState === GameState.GAME_ENDED) {
            this.setState({playerWon: true});
        } else if (this.game.getActivePlayer().isComputerPlayer()) {
            this.computerPlayPromise().then(() => {
                this.movePlayed();
            })
        }
    }

    exitGameClicked() {
        if (!this.game.getActivePlayer().isComputerPlayer()) {
            this.game.removePlayerFromGame(this.game.getFirstHumanPlayer());
            this.setState({gameEnded: true});
        }
    }

    replayPrev() {
        this.setState({inReplayMode: true});
        if (this.state.currReplayIndex === null || this.state.currReplayIndex === undefined)
            this.state.currReplayIndex = this.uiGameStatesArray.length - 1;
        if (this.state.currReplayIndex > 0)
            this.callSetState(this.uiGameStatesArray[--this.state.currReplayIndex]);
    }

    replayNext() {
        this.setState({inReplayMode: true});
        if (this.state.currReplayIndex === null || this.state.currReplayIndex === undefined)
            this.state.currReplayIndex = this.uiGameStatesArray.length - 1;
        if (this.state.currReplayIndex < this.uiGameStatesArray.length - 1)
            this.callSetState(this.uiGameStatesArray[++this.state.currReplayIndex]);
    }

    replayPause() {
        this.setState({inReplayMode: true});
    }

    replayResumeGame() {
        this.setState({inReplayMode: false});
        this.state.currReplayIndex = null;
        this.callSetState(this.uiGameStatesArray[this.uiGameStatesArray.length - 1]);
    }

    render() {
        const imgStyle = {
            width: 'fit-content',
            height: 'fit-content',
            alignSelf: 'center'
        };
        return (
            <div id="main-container">
                <div id="play-area-div">`
                    <div id="computer-player-and-table-container">
                        <ComputerPlayerContainer cards={this.state.computerPlayerCards}/>
                        <PlayingTableContainer topCardOnTable={this.state.topCardOnTable} game={this.game}
                                               regularPlayer={this.regularPlayer}
                                               pickedUpCardFromDeck={this.movePlayed}
                                               deckDisabled={this.state.activePlayer.isComputerPlayer() || this.state.inReplayMode}
                                               highlightDeck={this.game.getPossibleMoveForActivePlayer() === null && !this.state.activePlayer.isComputerPlayer()}
                                               userMessage={this.state.userMessage}
                        />
                        <PlayerWonContainer playerWon={this.state.playerWon}
                                            gameState={this.state.currentGameState}
                                            statistics={this.state.statistics}
                                            restartGameClick={this.restartGame}
                                            startReplayClick={this.replayPrev}
                        />
                    </div>
                    <PlayerContainer player={this.regularPlayer} cards={this.state.regularPlayerCards} game={this.game}
                                     movePlayed={this.movePlayed} inReplayMode={this.state.inReplayMode}/>
                </div>

                <div id="statistics-div">
                    <img src={takiLogo} alt="Taki Logo" style={imgStyle}/>
                    <StatisticsContainer statistics={this.state.statistics}
                                         activePlayer={this.state.activePlayer}
                                         inReplayMode={this.state.inReplayMode}
                                         exitGame={this.exitGameClicked}
                                         replayControls={this.replayControls}
                                         gameEnded={this.game.getGameState().gameState === GameState.GAME_ENDED}
                    />
                </div>
            </div>
        );
    }
}