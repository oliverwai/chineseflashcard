import React from "react";
import { Link } from "react-router-dom";
import { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";
import nav from "react-bootstrap/Navbar";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      user: null
    };
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <Link to="/" className="link">
              <h1>FlashCard</h1>
            </Link>
            <Link to="/leaderboard" className="link">
              <p>Leader Board</p>
            </Link>
            {this.state.user ? (
              <button onClick={this.logout}>Log Out</button>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default Navbar;
