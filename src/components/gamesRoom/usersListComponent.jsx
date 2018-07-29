import React from 'react';

const USER_REFRESH_INTERVAL = 2 * 1000;

export default class UsersListComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            userList: []
        };
        this.getAllUsers = this.getAllUsers.bind(this);
        this.logout = this.logout.bind(this);
    }

    /**
     * This method is called once all our children Elements
     * and our Component instances are mounted onto the Native UI
     */
    componentDidMount() {
        this.getAllUsers();
    }

    /**
     * update {@code userList} every {@code USER_REFRESH_INTERVAL}
     * @returns {Promise<Response>}
     */
    getAllUsers() {
        return fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getAllUsers, USER_REFRESH_INTERVAL);
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
                    console.log(`failed to logout user ${this.state.playerName}`, response);
                }
                this.props.handleLogout();
            })
    }

    render() {
        return (
            <div id='user-list-container'>
                Hello {this.props.userName}
                <button className="logout btn" onClick={this.props.logoutClicked}>Logout</button>
                list of all logged in users:
                {this.state.userList.map((entry, index) => (
                    <p key={entry.playerName + index}>{entry.playerName + ":" + entry.sessionId}</p>))}
            </div>
        )
    }

}
