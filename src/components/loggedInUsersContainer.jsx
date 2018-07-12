import React from 'react';
import ReactDOM from 'react-dom';

const USER_REFRESH_INTERVAL = 1000;

export default class LoggedInUsersContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            userList: []
        };
        this.getAllUsers = this.getAllUsers.bind(this);
        this.idCounter = 0;
    }

    render() {
        return (
            <div>
                {this.state.userList.map((entry, index) => (
                    <p key={entry.userName + index}>{entry.userName+":"+ entry.sessionId}</p>))}
            </div>
        );
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

}
