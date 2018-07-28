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
            <div>
                list of all games:
                {Object.values(this.state.allGames).map(game => (
                    <div key={game._gameId}>
                        <p> game ID: {game._gameId}, game name: {game._gameName}
                            <a href={''} onClick={this.gameSelected.bind(this, game._gameId)}>select || </a>
                            <a href={''} onClick={this.deleteGame.bind(this, game._gameId)}>delete</a>
                        </p>
                    </div>
                ))}
                <br/>
            </div>
        )
    }
}