/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";
import {GameState} from "../../server/logic/enums";

export default class StatisticsContainer extends React.Component {

    constructor(args) {
        super(...args);
        this.state = {
            timerValueInt: 0,
            timerValueStr: "00:00",
            restartTimer: false
        };
    }

    componentDidMount() {
        setInterval(() => {
            if (this.props.gameEnded) {
                this.setState({restartTimer: true});
            } else if (this.state.restartTimer) {
                this.setState({
                    timerValueStr: "00:00",
                    restartTimer: false
                });
            } else {
                this.setState({timerValueStr: this.props.statistics.gameStatistics.gameDuration});
            }
        }, 1000)
    }

    render() {
        const imgStyle = {
            width: '50px',
            height: '50px',
            alignSelf: 'center'
        };
        if (!this.props.statistics)
            return null;
        let enableExitButton = (this.props.currentGameState !== undefined && this.props.currentGameState.gameState === GameState.WAITING_FOR_PLAYERS);

        return (
            <div id="statistics-container">
                <div>{"Game timer: " + this.state.timerValueStr}</div>
                <button type="button"
                        title="players can't exit once the game has started"
                        onClick={this.props.exitGame}
                        className={(!enableExitButton ? 'disabled-button ' : ' ') + "red "}>
                    Exit game
                </button>

                <h5>Cards remaining:</h5>
                <table id="cardsRemainingTable">
                    <tbody>
                    <tr>
                        <th>Owner</th>
                        <th>Cards</th>
                    </tr>
                    <tr>
                        <td>Deck</td>
                        <td>{this.props.statistics.gameStatistics.cardsInDeck}</td>
                    </tr>
                    <tr>
                        <td>Table</td>
                        <td>{this.props.statistics.gameStatistics.cardsOnTable}</td>
                    </tr>
                    {Object.values(this.props.statistics.allPlayerStats).map(playerStats => (
                        <tr key={playerStats.playerName}
                            className={this.props.activePlayer._playerName === playerStats.playerName ? 'bold' : ''}>
                            <td>{playerStats.playerName} {this.props.activePlayer._playerName === playerStats.playerName ? '(playing...)' : ''}</td>
                            <td>{playerStats.numCardsInHand}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <h5>Total turns played: {this.props.statistics.gameStatistics.totalTurnsPlayed}</h5>
                <h5>Active player: {this.props.activePlayer !== undefined ? this.props.activePlayer._playerName : ""}
                </h5>
            </div>
        );
    };

}
