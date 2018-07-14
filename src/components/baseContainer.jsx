import React from 'react';
import LoggedInUsersContainer from "./loggedInUsersContainer.jsx";
import GamesRoomComponent from "./gamesRoomComponent.jsx";

/**
 * kind of entry point of all components
 */
export default class BaseContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            showLogin: true,
            userName: ""
        };

        this.handleSuccessLogin = this.handleSuccessLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.initLoginState = this.initLoginState.bind(this);
    }

    render() {
        return this.state.showLogin ?
            <LoggedInUsersContainer loginSuccessHandler={this.handleSuccessLogin}
                                    loginErrorHandler={this.handleLoginError}/> :
            <GamesRoomComponent userName={this.state.userName}
                                initLoginState={this.initLoginState}/>;
    }

    handleSuccessLogin() {
        this.setState(() => ({showLogin: false}), this.setUserName);
    }

    handleLoginError() {
        this.setState(() => ({showLogin: true}));
    }

    setUserName() {
        fetch('/users/activeUserName', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(userName => {
                this.setState(() => ({showLogin: false, userName: userName}));
            })
            .catch(err => {
                // in case we're getting unauthorized
                if (err.status === 401) {
                    this.setState(() => ({showLogin: true}));
                } else {
                    throw err;
                }
            });
    }

    initLoginState() {
        this.setState(() => ({showLogin: true, userName: ""}));
    }

}
