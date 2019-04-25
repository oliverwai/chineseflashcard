import React, { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";
import fire from "../img/firestreak.png"; // Tell Webpack this JS file uses this image
import ProgressBar from "./ProgressBar";
import ProfilePic from "./ProfilePic";

class Achievements extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("users");
    this.unsubscribe = null;
    // const uid= firebase.auth().currentUser.uid
    this.state = {
      user: null,
      uid: null,
      points: 0,
      dayStreak: 0,
      displayName: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        const uid = firebase.auth().currentUser.uid;
        var docRef = this.ref.doc(uid);
        docRef.get().then(doc => {
          const { dayStreak, displayName, points } = doc.data();
          this.setState({
            user,
            uid,
            displayName,
            points,
            dayStreak
          });
        });
      }
    });
  }

  render() {
    const level = Math.floor(this.state.points / 1000);
    const pointsdenom = (level + 1) * 1000;
    const pointsprogress = (this.state.points % 1000) / 10;
    const streakdenom = (Math.floor(this.state.dayStreak / 5) + 1) * 5;
    const streakprogress = (this.state.dayStreak % 5) * 20;

    return (
      <div>
        {this.state.user ? (
          <div className="container">
            <div className="row" />

            {/* MAIN COLUMN */}
            <div className="col s6">
              <div className="row">
                <ProfilePic value={level} />
              </div>
              <div className="row">
                <h5 className="centered">Welcome, {this.state.displayName}</h5>
              </div>
              <div className="row">
                <h5 className="centered">Level: {level}</h5>
              </div>
              {/* Progress Bar for Points */}
              <div className="row">
                <img src={fire} alt="badge" />
                <ProgressBar
                  title={"Points"}
                  num={this.state.points}
                  denom={pointsdenom}
                  progress={pointsprogress}
                />
              </div>
              {/* Progress Bar for Day Streaks */}
              <div className="row">
                <img src={fire} alt="badge" />

                <ProgressBar
                  title={"Login Streak"}
                  num={this.state.dayStreak}
                  denom={streakdenom}
                  progress={streakprogress}
                />
              </div>

              {/* Progress Bar for Quizes TBD*/}
              <div className="row">
                <img src={fire} alt="badge" />

                <ProgressBar
                  title={"Completed Quizzes"}
                  num={1}
                  denom={2}
                  progress={50}
                />
              </div>

              {/* Progress Bar for Quizes TBD*/}
              <div className="row">
                <img src={fire} alt="badge" />

                <ProgressBar
                  title={"Number of Perfect Quizzes"}
                  num={1}
                  denom={2}
                  progress={50}
                />
              </div>

              {/* Progress Bar for Quizes TBD*/}
              <div className="row">
                <img src={fire} alt="badge" />

                <ProgressBar
                  title={"Number of Decks"}
                  num={1}
                  denom={2}
                  progress={50}
                />
              </div>

              {/* Progress Bar for Quizes TBD*/}
              <div className="row">
                <img src={fire} alt="badge" />

                <ProgressBar
                  title={"Number of Words"}
                  num={1}
                  denom={2}
                  progress={50}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>You must be logged in to see your Achievements</p>
          </div>
        )}
      </div>
    );
  }
}

function calcLevel(props) {
  return props.value;
}

function calcNextLevel(props) {
  return props.value;
}

export default Achievements;
