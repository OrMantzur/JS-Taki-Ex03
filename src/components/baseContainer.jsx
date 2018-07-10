import React from 'react';

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
        // this.printUserList = this.printUserList.bind(this);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleLogin}>
                    <label htmlFor="userName">name: </label>
                    <input name="userName"/>
                    <input type="submit" value="Login"/>
                </form>
                {/*{this.printUserList()}*/}
            </div>
        )
    }

    handleLogin(formEvent) {
        // TODO test that
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

    // printUserList() {
    //     if (this.state.loginSuccess) {
    //         // print all logged in users
    //         let allUsers = fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
    //             .then(response=>{
    //                 let allUsers2 = response.json();
    //                 if (allUsers !== undefined || allUsers !== null) {
    //                     return (<div>
    //                             {allUsers.map((sessionId, userName) => (
    //                                 <p key={userName}>{sessionId}: {userName}</p>))}
    //                         </div>
    //                     )
    //                 }
    //             });
    //     }
    // }
}
