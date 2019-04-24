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
    const oneday = 60 * 60 * 24 * 1000;

    await auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      var newuser = result.additionalUserInfo.isNewUser;
      this.setState({
        user,
        newuser,
        points: 0,
        dayStreak: 0,
        nextLoginBonus: 0
      });

      var docRef = firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid);
      var o = {};
      o.lastLoginDate = Date.now();

      if (newuser) {
        //new user, create a ton of fields
        o.displayName = firebase.auth().currentUser.displayName;
        o.email = user.email;
        o.accountCreatedDate = Date.now();
        o.points = 0;
        o.dayStreak = 0;
        o.nextLoginBonus = Date.now() + 60 * 60 * 24 * 1000;
        docRef.update(o);
        console.log("new user");
      }
      //old user
      else {
        //get data
        docRef.get().then(doc => {
          const { dayStreak, points, nextLoginBonus } = doc.data();
          this.setState({
            dayStreak,
            points,
            nextLoginBonus
          });

          //login bonus
          console.log(o.lastLoginDate);
          console.log(this.state.nextLoginBonus);
          if (o.lastLoginDate >= this.state.nextLoginBonus) {
            o.points = this.state.points + 100;
            // streak if logining in < 48 hours since last visit
            if (o.lastLoginDate < this.state.nextLoginBonus + oneday) {
              o.dayStreak = this.state.dayStreak + 1;
            } else {
              o.dayStreak = 0;
            }
            // set next Login Bonus time
            o.nextLoginBonus = Date.now() + oneday;
            docRef.update(o);
          }
        });
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
        <div className="nav-wrapper container">
          <Link to="/" className="link brand-logo center">
            漢字 Hanzi
          </Link>
          <ul id="nav-mobile" className="left hide-on-med-and-down">
            <li>
              <Link to="/leaderboard" className="link">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/achievements" className="link">
                Achievements
              </Link>
            </li>
            <li />
          </ul>
          <ul className="right">
            {this.state.user ? (
              <button
                className="waves-effect waves-light btn blue lighten-1"
                onClick={this.logout}
              >
                Log Out
              </button>
            ) : (
              <button
                className="waves-effect waves-light btn blue lighten-1"
                onClick={this.login}
              >
                Log In
              </button>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
