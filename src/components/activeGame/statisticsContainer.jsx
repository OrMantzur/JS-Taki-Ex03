/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from "react";
import button_pause from "../../server/takiImages/button_pause.png";
import button_play from "../../server/takiImages/button_play.png";
import button_prev from "../../server/takiImages/button_prev.png";
import button_next from "../../server/takiImages/button_next.png";

export default class StatisticsContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            timerValueInt: 0,
            timerValueStr: "00:00",
            restartTimer: false
        };

        setInterval(() => {
            if (this.props.gameEnded) {
                this.setState({restartTimer: true});
            } else if (!this.props.inReplayMode) {
                if (this.state.restartTimer) {
                    this.setState({
                        timerValueInt: 0,
                        timerValueStr: "00:00",
                        restartTimer: false
                    })
                } else {
                    let prevTimerValue = this.state.timerValueInt;
                    let secondsPlayed = Math.floor(prevTimerValue) % 60;
                    let minutesPlayed = Math.floor(prevTimerValue / 60);
                    let newTimerValueStr = (minutesPlayed < 10 ? "0" + minutesPlayed : minutesPlayed) + ":" + (secondsPlayed < 10 ? "0" + secondsPlayed : secondsPlayed);
                    this.setState({timerValueInt: prevTimerValue + 1, timerValueStr: newTimerValueStr});
                }
            }
        }, 1000)
    }

    render() {
        const imgStyle = {
            width: '50px',
            height: '50px',
            alignSelf: 'center'
        };

        return (
            <div id="statistics-container">
                <div>{this.props.inReplayMode ? "Replay mode - paused" : ("Game timer: " + this.state.timerValueStr)}</div>
                <div className={"replay-controls-div"}>
                    <img src={button_prev} alt="prev" className={"replay-button"} style={imgStyle}
                         hidden={!this.props.inReplayMode} onClick={this.props.replayControls.prev}/>
                    <img src={button_pause} alt="pause"
                         className={(this.props.activePlayer.isComputerPlayer() ? 'disabled-button ' : ' ') + "replay-button"}
                         style={imgStyle}
                         hidden={this.props.inReplayMode} onClick={this.props.replayControls.pause}/>
                    <img src={button_play} alt="play" className={"replay-button"} style={imgStyle}
                         hidden={!this.props.inReplayMode} onClick={this.props.replayControls.resume}/>
                    <img src={button_next} alt="next" className={"replay-button"} style={imgStyle}
                         hidden={!this.props.inReplayMode} onClick={this.props.replayControls.next}/>
                </div>
                <button type="button"
                        onClick={this.props.exitGame}
                        className={(this.props.activePlayer.isComputerPlayer() || this.props.inReplayMode ? 'disabled-button ' : ' ') + "red "}>
                    End game
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
                    <tr>
                        <td>Human player</td>
                        <td>{this.props.statistics.regularPlayerStats.numCardsInHand}</td>
                    </tr>
                    <tr>
                        <td>Computer player</td>
                        <td>{this.props.statistics.computerPlayerStats.numCardsInHand}</td>
                    </tr>
                    </tbody>
                </table>
                <h5>Total turns played: {this.props.statistics.gameStatistics.totalTurnsPlayed}</h5>
                <h5>Active player: {this.props.activePlayer !== undefined ? this.props.activePlayer.getName() : ""}
                </h5>
            </div>
        );
    };
}