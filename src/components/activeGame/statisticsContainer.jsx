/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";

const GameState = require('../../server/logic/enums').GameState;

export default class StatisticsContainer extends React.Component {

    constructor(args) {
        super(...args);
    }

    render() {
        if (!this.props.statistics)
            return null;
        // ranking will be !== 0 if the player has reached 0 cards
        let enableExitButton = this.props.loggedInPlayer._ranking !== 0 || (this.props.currentGameState !== undefined && this.props.currentGameState.gameState === GameState.WAITING_FOR_PLAYERS);
        return (
            <div id="statistics-container">
                <div>{"Game timer: " + this.props.statistics.gameStatistics.gameDuration}</div>
                <button type="button"
                        title="players can't exit once the game has started"
                        onClick={this.props.exitGame}
                        className={(!enableExitButton ? 'disabled-button ' : ' ') + "red "}>
                    Exit game
                </button>

                <h5>Cards remaining:</h5>
                <table id="cardsRemainingTable">
                    <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Cards Remaining</th>
                    </tr>
                    </thead>
                    <tbody>
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
