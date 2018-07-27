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
            //TODO delete
            console.log("in player won container");
            console.log(this.props);
            let stats = this.props.statistics;
            return (
                <div id="playerWonScreen">
                    <h1>{this.props.gameState.additionalInfo.getName()} has won the game!</h1>
                    <button className="green" onClick={this.props.restartGameClick}>Play again</button>
                    <br/>
                    <button className="green" onClick={this.props.startReplayClick}>View replay</button>
                    <h3><u>Game statistics:</u></h3>
                    <p>
                        Total turns played: {stats.gameStatistics.totalTurnsPlayed}<br/>
                        Total game duration (including replays): {stats.gameStatistics.gameDuration}
                    </p>
                    <h3><u>Human player:</u></h3>
                    <p>
                        Total turns played: {stats.regularPlayerStats.totalTurnsPlayed} <br/>
                        Average turn time: {stats.regularPlayerStats.avgTurnTime} <br/>
                        Times reached last card: {stats.regularPlayerStats.timesReachedSingleCard}
                    </p>
                    <h3><u>Computer player:</u></h3>
                    <p>
                        Total turns played: {stats.computerPlayerStats.totalTurnsPlayed} <br/>
                        Average turn time: {stats.computerPlayerStats.avgTurnTime} <br/>
                        Times reached last card: {stats.computerPlayerStats.timesReachedSingleCard}
                    </p>
                </div>
            )
        }
        else
            return null
    };
}