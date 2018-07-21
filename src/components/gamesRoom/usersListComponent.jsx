import React from 'react';

const USER_REFRESH_INTERVAL = 2000;

export default class UsersListComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            userList: []
        };

        this.getAllUsers = this.getAllUsers.bind(this);
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
                this.setState(() => ({userList: userList}));
            })
            .catch(err => {
                throw err
            });
    }

    render() {
        return (
            <div>
                list of all logged in users:
                {this.state.userList.map((entry, index) => (
                    <p key={entry.userName + index}>{entry.userName + ":" + entry.sessionId}</p>))}
            </div>
        )
    }
}