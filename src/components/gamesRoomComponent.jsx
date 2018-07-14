import React from 'react';

const USER_REFRESH_INTERVAL = 1000;

export default class GamesRoomComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            userList: []
        };

        this.getAllUsers = this.getAllUsers.bind(this);
        this.logout = this.logout.bind(this);
    }

    render() {
        return (
            <div>
                <div>

                    hello {this.props.userName}

                    <div>
                        list of all logged in users:
                        {this.state.userList.map((entry, index) => (
                            <p key={entry.userName + index}>{entry.userName + ":" + entry.sessionId}</p>))}
                    </div>

                    <button className="logout btn" onClick={this.logout}>Logout</button>

                </div>
            </div>
        )
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
                setTimeout(this.getAllUsers, USER_REFRESH_INTERVAL);
                return response.json();
            })
            .then(userList => {
                this.setState(() => ({userList}));
            })
            .catch(err => {
                throw err
            });
    }

    logout() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    console.log(`failed to logout user ${this.state.userName}`, response);
                }
                this.props.initLoginState();
            })
    }

}
