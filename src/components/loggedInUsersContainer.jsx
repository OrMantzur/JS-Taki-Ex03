import React from 'react';


export default class LoggedInUsersContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            errMessage: ""
        };

        this.login = this.login.bind(this);
        this.renderLoginErrorMessage = this.renderLoginErrorMessage.bind(this);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.login}>
                    <label htmlFor="userName">name: </label>
                    <input name="userName"/>
                    <input type="submit" value="Login"/>
                </form>
                {this.renderLoginErrorMessage()}
            </div>
        );
    }

    login(formEvent) {
        formEvent.preventDefault();
        const userName = formEvent.target.elements.userName.value;
        fetch('/users/addUser', {method: 'POST', body: userName, credentials: 'include'})
            .then(response => {
                if (response.ok) {
                    console.log("login success");
                    this.setState(() => ({errMessage: ""}));
                    this.props.loginSuccessHandler();
                } else {
                    if (response.status === 403) {
                        this.setState(() => ({errMessage: "user name already exist, please try another one"}));
                    }
                    this.props.loginErrorHandler();
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
