import React from 'react';
import axios from 'axios';

//classes are not hoisted, so just to be safe put them in the top
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
            <div className="register-comp">
                {this.state.error && <div className="error">Oops, something went wrong!</div>}
                <input name="first" placeholder="first name" onChange={this.handleChange} />
                <input name="last" placeholder="last name" onChange={this.handleChange} />
                <input name="email" placeholder="email" onChange={this.handleChange} />
                <input name="password" placeholder="password" type="password" onChange={this.handleChange} />
                <button onClick={this.submit}>REGISTER</button>
            </div>
        );
    }
}


export function Welcome() {
    return (
        <div className="welcome-page">
            <h1>My Life Socks!</h1>
            <img src="/logo.png" />
            <h3>register and meet fellow sock-lovers</h3>
            <div>
                <Registration />
            </div>
            <p>Already a sock-lover? <a href="#">Log in</a> here.</p>
        </div>
    );
}
