/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
import React from 'react';
import PlayingTableContainer from "./playingTableContainer.jsx";
import PlayerContainer from "./playerContainer.jsx";
import StatisticsContainer from "./statisticsContainer.jsx";
import OtherPlayersContainer from "./otherPlayersContainer.jsx";
import PlayerWonContainer from "./playerWonContainer.jsx";
// import Game, {GameState, GameType} from "../../server/logic/game";
// import Player from "../../server/logic/player";
import takiLogo from "../../server/takiImages/TAKI_logo.png";
import * as enums from "../../server/logic/enums";

const COMPUTER_DELAY = 1.5 * 1000;
const GAME_STATE_REFRESH_INTERVAL = 2 * 1000;

export default class ActiveGameBaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        // this.state = {};
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

    // componentWillMount() {
    //     this.updateUIGameState();
    // }

    updateUIGameState() {
        this.setState({test: "test"});
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
                computerPlayerStats: gameStateUI.statistics.computerPlayerStats,
            }
        });
    }

    restartGame() {
        this.updateUIGameState();
    }

    exitGameClicked() {
        //TODO implement (can't exit during game)
    }

    render() {
        const imgStyle = {
            width: 'fit-content',
            height: 'fit-content',
            alignSelf: 'center'
        };
        if (!this.state)
            return <div><h1>gameState has not bee set yet</h1></div>;

        console.log(this.state);
        return (
            <div id="main-container">
                <div id="play-area-div">`
                    <div id="other-players-and-table-container">
                        {/*//TODO change to "other players' cards*/}
                        <OtherPlayersContainer playersToCardsMap={this.state.otherPlayersCards}/>
                        <PlayingTableContainer topCardOnTable={this.state.topCardOnTable}
                                               pickedUpCardFromDeck={this.updateUIGameState}
                                               deckDisabled={this.state.gameControlsLocked}
                                               highlightDeck={this.state.possibleMoveForActivePlayer !== null && !this.state.gameControlsLocked}
                                               userMessage={this.state.userMessage}
                        />
                        <PlayerWonContainer playerWon={this.state.playerWon}
                                            gameState={this.state.currentGameState}
                                            statistics={this.state.statistics}
                                            restartGameClick={this.restartGame}
                        />
                    </div>
                    <PlayerContainer gameControlsLocked={this.state.gameControlsLocked}
                                     currentGameState={this.state.currentGameState}
                                     cards={this.state.playerCards}
                                     movePlayed={this.updateUIGameState}/>
                </div>

                <div id="statistics-div">
                    <img src={takiLogo} alt="Taki Logo" style={imgStyle}/>
                    <StatisticsContainer statistics={this.state.statistics}
                                         gameControlsLocked={this.state.gameControlsLocked}
                                         activePlayer={this.state.activePlayer}
                                         exitGame={this.exitGameClicked}
                                         gameEnded={this.state.currentGameState && this.state.currentGameState.gameState === enums.GameState.GAME_ENDED}
                    />
                </div>
            </div>
        );
    }
}