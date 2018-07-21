import React from 'react';

const GAMES_REFRESH_INTERVAL = 2000;

export default class GamesListComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            allGames: []
        };

        this.getAllGames = this.getAllGames.bind(this);
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
                setTimeout(this.getAllGames, GAMES_REFRESH_INTERVAL);
                return response.json();
            })
            .then(allGames => {
                this.setState(() => ({allGames}));
            })
            .catch(err => {
                throw err
            });
    }

    render() {
        return (
            <div>
                list of all games:
                {/*{this.state.allGames.map((entry, index) => (*/}
                    {/*<p key={entry.gameId + index} onClick={alert("clicked game " + index)}>{entry.gameId}</p>))}*/}
            </div>
        )
    }
}