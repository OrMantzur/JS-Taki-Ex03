/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from 'react';

const USER_REFRESH_INTERVAL = 2 * 1000;

export default class UsersListComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            userList: {}
        };
        this.getAllPlayers = this.getAllPlayers.bind(this);
        this.logout = this.logout.bind(this);
    }

    /**
     * This method is called once all our children Elements
     * and our Component instances are mounted onto the Native UI
     */
    componentDidMount() {
        this.getAllPlayers();
    }

    /**
     * update {@code userList} every {@code USER_REFRESH_INTERVAL}
     * @returns {Promise<Response>}
     */
    getAllPlayers() {
        return fetch('/users/allPlayers', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getAllPlayers, USER_REFRESH_INTERVAL);
                return response.json();
            })
            .then(userList => {
                this.setState({userList: userList});
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

    logout() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    console.log(`The player \"${this.state.playerName}\" failed to logout`, response);
                }
                this.props.handleLogout();
            })
    }

    render() {
        return (
            <div id='players-list-container'>
                <p>Logged in as: <br/><b>"{this.props.userName}"</b></p>
                <button id='logout-button' className="red" onClick={this.logout}>Logout</button>
                <table id='logged-in-players-table'>
                    <thead>
                        <tr>
                            <th>Logged in players</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Object.values(this.state.userList).map(player => (
                        <tr key={player._playerId}>
                            <td>{player._playerName}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }

}
