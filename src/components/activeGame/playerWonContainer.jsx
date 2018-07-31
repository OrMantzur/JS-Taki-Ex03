/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";

export default class PlayerWonContainer extends React.Component {

    constructor(args) {
        super(...args);
    }

    render() {
        if (this.props.playerWon) {
            let stats = this.props.statistics;
            console.log("player won screen props");
            console.log(this.props);
            return (
                <div id="playerWonScreen">
                    <h1>{this.props.gameState.additionalInfo._playerName} has won the game!</h1>
                    <button className="green" onClick={this.props.endGame}>End game</button>
                    <br/>
                    <h3><u>Game statistics:</u></h3>
                    <p>
                        Total turns played: {stats.gameStatistics.totalTurnsPlayed}<br/>
                        Total game duration: {stats.gameStatistics.gameDuration}
                    </p>
                    <h3><u>Player Statistics:</u></h3>
                    <table>
                        <thead>
                        <tr>
                            <th> Player Name</th>
                            <th> Ranking</th>
                            <th> Turns Played</th>
                            <th> Avg Turn Time</th>
                            <th> Times Reached Single Card</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.values(stats.allPlayerStats).map(playerStats => (
                            <tr key={playerStats.playerName}
                                className={this.props.loggedInPlayer._playerName === playerStats.playerName ? 'bold' : ''}>
                                <td>{playerStats.playerName} {this.props.loggedInPlayer._playerName === playerStats.playerName ? '- this is you (•ᴗ•)' : ''}</td>
                                <td>{playerStats.ranking} {playerStats.ranking === 1 ? "(winner)" : ""}</td>
                                <td>{playerStats.totalTurnsPlayed}</td>
                                <td>{playerStats.avgTurnTime}</td>
                                <td>{playerStats.timesReachedSingleCard}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        else
            return null
    };

}
