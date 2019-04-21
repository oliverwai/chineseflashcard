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
      user: null,
      newuser: ""
    };
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
        newuser: false
      });
    });
    window.location.reload();
  }

  // Now checks if a user is new or not
  // if new adds a ton of data to DB
  async login() {
    await auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      var newuser = result.additionalUserInfo.isNewUser;
      this.setState({
        user,
        newuser
      });

      var docRef = firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid);
      var o = {};
      if (newuser) {
        //user is already there, write only last login
        o.displayName = firebase.auth().currentUser.displayName;
        o.email = user.email;
        o.accountCreatedDate = Date.now();
        o.lastLoginDate = Date.now();
        o.points = 0;
        docRef.update(o);
        console.log("new user");
      } else {
        //new user
        // Send it
        o.lastLoginDate = Date.now();

        docRef.update(o);
        console.log("old user");
      }
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
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="link brand-logo left">
            Chinese Flashcards
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to="/leaderboard" className="link">
                Leaderboard
              </Link>
            </li>
            <li>
              {this.state.user ? (
                <button
                  className="waves-effect waves-light btn green lighten-2"
                  onClick={this.logout}
                >
                  Log Out
                </button>
              ) : (
                <button
                  className="waves-effect waves-light btn green lighten-2"
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
