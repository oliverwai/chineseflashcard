import React from "react";
import { Link } from "react-router-dom";
import { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";

class NavBar extends Component {
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
    window.location.reload();
  }

  async login() {
    await auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });

    window.location.reload();
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  /*
  
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
            <p>Points: </p>
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
  */

  render() {
    return (
      <nav>
        <div class="nav-wrapper grey darken-3">
          <Link to="/" className="link brand-logo">
            Chinese Flashcards
          </Link>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li>
              <Link to="/leaderboard" className="link">
                Leader Board
              </Link>
            </li>
            <li>
              {this.state.user ? (
                <button
                  class="waves-effect waves-light btn green"
                  onClick={this.logout}
                >
                  Log Out
                </button>
              ) : (
                <button
                  class="waves-effect waves-light btn green"
                  onClick={this.login}
                >
                  Log In
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
