import React from 'react';
import ReactDOM from 'react-dom';
import LoggedInUsersContainer from "./loggedInUsersContainer.jsx";

/**
 * kind of entry point of all components
 */
export default class BaseContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            loginSuccess: false
        };

        this.handleLogin = this.handleLogin.bind(this);
    }

    render() {
        return (
            <div>

                <form onSubmit={this.handleLogin}>
                    <label htmlFor="userName">name: </label>
                    <input name="userName"/>
                    <input type="submit" value="Login"/>
                </form>

                <LoggedInUsersContainer/>

            </div>
        )
    }

    handleLogin(formEvent) {
        formEvent.preventDefault();
        const userName = formEvent.target.elements.userName.value;
        fetch('/users/addUser', {method: 'POST', body: userName, credentials: 'include'})
            .then(response => {
                if (response.ok) {
                    console.log("userName form success");
                    this.setState(() => ({loginSuccess: true}));
                } else {
                    console.log("userName form fail");
                    this.setState(() => ({loginSuccess: false}));
                }
            });
        return false;
    }

}
