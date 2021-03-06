/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from 'react';

const enums = require('../../server/logic/enums');
const GAMES_REFRESH_INTERVAL = 2000;

export default class GamesListComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            allGames: {},
        };
        this.getAllGames = this.getAllGames.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.generateGameStateString = this.generateGameStateString.bind(this);
    }

    /**
     * This method is called once all our children Elements
     * and our Component instances are mounted onto the Native UI
     */
    componentDidMount() {
        this.getAllGames();
    }

    /**
     * update {@code userList} every {@code USER_REFRESH_INTERVAL}
     * @returns {Promise<Response>}
     */
    getAllGames() {
        return fetch('/games/allGames', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getAllGames, GAMES_REFRESH_INTERVAL);
                return response.json();
            })
            .then(allGames => {
                this.setState({allGames: allGames});
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

    deleteGame(gameIdToDelete) {
        let body = {gameId: gameIdToDelete};
        fetch('/games/deleteGame', {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw Error(text)
                });
            }
            console.log("GameId " + gameIdToDelete + " was deleted successfully");
        }).catch(errorMessage => {
            alert(errorMessage);
        });
    }

    joinGame(gameIdSelected) {
        let body = {gameId: gameIdSelected};
        fetch('/games/joinGame', {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include'
        }).then(response => {
            if (response.ok) {
                this.props.gameSelected(gameIdSelected);
            }
            return true;
        });
    }

    generateGameStateString(gameState){
        let gameStateString;
        switch (gameState) {
            case (enums.GameState.WAITING_FOR_PLAYERS):
                gameStateString = "waiting for players to join";
                break;
            case  (enums.GameState.GAME_ENDED):
                gameStateString = "Game ended - waiting for all players to exit";
                break;
            default:
                gameStateString = "Game in progress...";
                break;
        }

        return gameStateString;
    }

    render() {
        return (
            <div id='games-list-container'>
                <table id='games-list-table'>
                    <thead>
                    <tr>
                        <th>Game Title</th>
                        <th>Game Creator</th>
                        <th>Players in game</th>
                        <th>Game State</th>
                        <th>
                            <button id='add-game-button' className='blue'
                                    onClick={this.props.setAddGameVisibility.bind(this, true)}>add new game
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.values(this.state.allGames).map(game => (
                        <tr key={game._gameId}>
                            <td>{game._gameName}</td>
                            <td>{game._gameCreator._playerName}</td>
                            <td>{game._players.length}/{game._numPlayersToStartGame}</td>
                            <td>{this.generateGameStateString(game._gameState.gameState)}</td>
                            <td>
                                <button onClick={this.joinGame.bind(this, game._gameId)}
                                        title="the game will start once enough users join"
                                        className={game._players.length === parseInt(game._numPlayersToStartGame) || game._gameState.gameState !== enums.GameState.WAITING_FOR_PLAYERS ?
                                            "disabled-button" : "" + " green"}>
                                    Join
                                </button>
                                <button onClick={this.deleteGame.bind(this, game._gameId)}
                                        title="a game can only be deleted by it's creator"
                                        className={game._players.length !== 0 || this.props.userName !== game._gameCreatorName ?
                                            "disabled-button" : "" + " red"}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }

}
