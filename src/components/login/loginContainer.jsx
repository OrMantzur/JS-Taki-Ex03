import React from 'react';

export default class LoginContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            errMessage: null
        };

        this.login = this.login.bind(this);
        this.renderLoginErrorMessage = this.renderLoginErrorMessage.bind(this);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.login}>
                    <label htmlFor="playerName">name: </label>
                    <input name="playerName"/>
                    <input type="submit" value="Login"/>
                </form>
                <p>{this.state.errMessage}</p>
                {/*{this.renderLoginErrorMessage()}*/}
            </div>
        );
    }

    login(formEvent) {
        formEvent.preventDefault();
        let playerName = {"playerName": formEvent.target.elements.playerName.value};
        fetch('/users/addPlayer', {method: 'POST', body: JSON.stringify(playerName), credentials: 'include'})
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    if (response.status === 403) {
                        this.setState({errMessage: "User name already exist, please try another one"});
                    }
                    this.props.loginErrorHandler();
                    return null;
                }
            })
            .then(player => {
                if (player !== null) {
                    console.log("\"" + player._playerName + "\" has logged in and was added to the players list");
                    this.setState({errMessage: null});
                    this.props.loginSuccessHandler();
                }
            });
        return false;
    }

    renderLoginErrorMessage() {
        if (this.state.errMessage) {
            return (
                <div>
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

}
