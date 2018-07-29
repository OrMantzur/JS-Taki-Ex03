import React from 'react';

const GAMES_REFRESH_INTERVAL = 2000;
const enums = require('../../server/logic/enums');
const displayAddGameStyle = {
    display: "flex"
};
export default class GamesListComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            allGames: {},
            showAddGame: false
        };
        this.getAllGames = this.getAllGames.bind(this);
        this.addGame = this.addGame.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
        this.displayAddGame = this.displayAddGame.bind(this);
        this.setAddGameFormVisibility = this.setAddGameFormVisibility.bind(this);
        this.joinGame = this.joinGame.bind(this);
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

    deleteGame(gameId) {
        this.props.deleteGame(gameId);
    }

    displayAddGame() {
        if (this.state.showAddGame) {
            return displayAddGameStyle;
        }
        else
            return null;
    }

    addGame(formEvent) {
        formEvent.preventDefault();
        const body = {
            gameTitle: formEvent.target.elements.gameTitle.value,
            gameType: formEvent.target.elements.gameType.value,
            numPlayers: formEvent.target.elements.numPlayers.value
        };

        fetch('/games/addGame', {method: 'POST', body: JSON.stringify(body), credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw Error(text)
                    });
                } else {
                    console.log("game " + body.gameTitle + " was added successfully");
                }
            })
            .then(() =>
                this.setAddGameFormVisibility(false)
            )
            .catch(errorMessage => {
                alert(errorMessage);
            });
        formEvent.target.reset();
    }

    deleteGame(gameIdToDelete) {
        let body = {gameId: gameIdToDelete};
        // delete game
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
            console.log("gameId " + gameIdToDelete + " delete successfully");
        }).catch(errorMessage => {
            alert(errorMessage);
        });
    }

    joinGame(gameIdSelected) {
        let body = {gameId: gameIdSelected};
        // start game
        fetch('/games/joinGame', {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include'
        }).then(response => {
            if (response.ok) {
                this.props.gameSelected(gameIdSelected);
            }
            return response.json();
        });
    }

    setAddGameFormVisibility(showAddGame) {
        this.setState({showAddGame: showAddGame});
    }

    render() {
        return (
            <div id='games-list-container'>
                <table id='games-list-table'>
                    <thead>
                    <tr>
                        <th>Game ID</th>
                        <th>Game Title</th>
                        <th>Players in game</th>
                        <th>Game State</th>
                        <th>
                            <button id='add-game-button' className='blue'
                                    onClick={this.setAddGameFormVisibility.bind(this, true)}>add new game
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.values(this.state.allGames).map(game => (
                        <tr key={game._gameId}>
                            <td>{game._gameId}</td>
                            <td>{game._gameName}</td>
                            <td>{game._players.length}/{game._numPlayersToStartGame}</td>
                            <td>{game._gameState.gameState}</td>
                            <td>
                                <button onClick={this.joinGame.bind(this, game._gameId)}
                                        className={game._players.length == game._numPlayersToStartGame ? "disabled-button" : "" + " green"}>
                                    Join Game
                                </button>
                                <button onClick={this.deleteGame.bind(this, game._gameId)}
                                        className={game._players.length == game._numPlayersToStartGame ? "disabled-button" : "" + " red"}>
                                    Delete Game
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div id='add-new-game-form-container' style={this.displayAddGame()}>
                    <form onSubmit={this.addGame}>
                        <label className="gameTitle-label" htmlFor="gameTitle"> title: </label>
                        <input className="gameTitle-input" name="gameTitle"/>
                        <label className="gameType-label" htmlFor="gameType"> game type: </label>
                        <select name="gameType">
                            <option value={enums.GameType.BASIC}>Basic</option>
                            <option value={enums.GameType.ADVANCED}>Advanced</option>
                        </select>
                        <label className="numPlayers-label" htmlFor="numPlayers"> num players: </label>
                        <input type="number" name="numPlayers" min="2" max="4" defaultValue="2"/>
                        <input className="submit-btn btn" type="submit" value="Add Game"/>
                    </form>
                </div>
            </div>
        )
    }

}
