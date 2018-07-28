import React from 'react';

const GAMES_REFRESH_INTERVAL = 2000;

export default class GamesListComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            allGames: {}
        };

        this.getAllGames = this.getAllGames.bind(this);
        this.gameSelected = this.gameSelected.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
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

    gameSelected(gameId) {
        this.props.gameSelected(gameId);
    }

    deleteGame(gameId) {
        this.props.deleteGame(gameId);
    }

    render() {
        return (
            <div id='games-list-container'>
                <button onClick={this.props.addGameClicked.bind(this, true)}>add game</button>
                <table>
                    <tr>
                        <th>Game ID</th>
                        <th>Game Title</th>
                        <th>Players in game</th>
                        <th>Game State</th>
                        <th></th>
                    </tr>

                    {Object.values(this.state.allGames).map(game => (
                        <tr key={game._gameId}>
                            <td>{game._gameId}</td>
                            <td>{game._gameName}</td>
                            <td>{game._players.length}/{game._numPlayersToStartGame}</td>
                            <td>{game._gameState.gameState}</td>
                            <td>
                                <button onClick={this.gameSelected.bind(this, game._gameId)}
                                        className={game._players.length == game._numPlayersToStartGame ? "disabled-button" : ""}>Join
                                    Game
                                </button>
                                <button onClick={this.deleteGame.bind(this, game._gameId)}
                                        className={game._players.length == game._numPlayersToStartGame ? "disabled-button" : ""}>Delete
                                    Game
                                </button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        )
    }
}