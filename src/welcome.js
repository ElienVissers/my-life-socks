import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import axios from './axios';


export class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        axios.post('/welcome/register', {
            first: this.first,
            last: this.last,
            email: this.email,
            password: this.password
        }).then(({data}) => {
            if (data.success) {
                //reload the page (the server will redirect to the / route)
                //the replace method is perfect because the /welcome route will not even be in browser history (user can't go back there with back button)
                location.replace('/');
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }
    render() {
        return (
            <div className="user-input">
                <h3>register and meet fellow sock-lovers</h3>
                {this.state.error && <div className="error">Oops, something went wrong!</div>}
                <input name="first" placeholder="first name" onChange={this.handleChange} />
                <input name="last" placeholder="last name" onChange={this.handleChange} />
                <input name="email" placeholder="email" onChange={this.handleChange} />
                <input name="password" placeholder="password" type="password" onChange={this.handleChange} />
                <button onClick={this.submit}>REGISTER</button>
                <p>Already a sock-lover? <Link to="/login">Log in</Link> here.</p>
            </div>
        );
    }
}

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        axios.post('/welcome/login', {
            email: this.email,
            password: this.password
        }).then(({data}) => {
            this.setState({
                notRegistered: null,
                error: null
            });
            if (data.success) {
                location.replace('/');
            } else if (data.notRegistered) {
                this.setState({
                    notRegistered: true
                });
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }
    render() {
        return (
            <div className="user-input">
                <h3>log in and meet fellow sock-lovers</h3>
                {this.state.notRegistered && <div className="error">Oops! You are not a sock-lover yet, please register first.</div>}
                {this.state.error && <div className="error">Oops! Please make sure your password is correct.</div>}
                <input name="email" placeholder="email" onChange={this.handleChange} />
                <input name="password" placeholder="password" type="password" onChange={this.handleChange} />
                <button onClick={this.submit}>LOGIN</button>
                <p>Not yet a sock-lover? <Link to="/">Register</Link> here.</p>
            </div>
        );
    }
}

export function Welcome() {
    return (
        <div className="welcome-page">
            <h1>My Life Socks!</h1>
            <img src="/logo.png" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
