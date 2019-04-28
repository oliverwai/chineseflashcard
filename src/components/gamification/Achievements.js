import React, { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";
import { Link } from "react-router-dom";
import fire from "../img/firestreak.png"; // Tell Webpack this JS file uses this image
import points from "../img/points.png";
import ProgressBar from "./ProgressBar";
import ProfilePic from "./ProfilePic";
import LevelPic from "./LevelPic";

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
      displayName: null,
      doneQuizCount: 0,
      deckSize: 0,
      perfectQuizCount: 0,
      overXPCount: 0
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        const uid = firebase.auth().currentUser.uid;

        var docRef = this.ref.doc(uid);
        docRef.get().then(doc => {
          const {
            deckSize,
            doneQuizCount,
            dayStreak,
            displayName,
            points,
            perfectQuizCount,
            overXPCount
          } = doc.data();
          this.setState({
            user,
            uid,
            displayName,
            points,
            dayStreak,
            doneQuizCount,
            deckSize,
            perfectQuizCount,
            overXPCount
          });
        });
      }
    });
  }

  render() {
    const level = Math.floor(this.state.points / 1000);

    return (
      <div>
        {this.state.user ? (
          <div className="container" style={{ width: "50%" }}>
            <div className="row">
              <Link
                to={{
                  pathname: "/"
                }}
              >
                <button className="btn-floating btn-large waves-effect waves-light blue">
                  <i className="material-icons">arrow_back</i>
                </button>
              </Link>
            </div>

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
                <img src={points} style={{ width: 80, height:80}} alt="badge" />
                {generateProgress(this.state.points, 1000, "Points")}
              </div>
              {/* Progress Bar for Day Streaks */}
              <div className="row">
                <LevelPic value={Math.floor(this.state.dayStreak / 5)} />
                {generateProgress(this.state.dayStreak, 5, "Login Streak")}
              </div>

              {/* Progress Bar for Quizes TBD*/}
              <div className="row">
              <LevelPic value={Math.floor(this.state.doneQuizCount / 5)} />
                {generateProgress(
                  this.state.doneQuizCount,
                  5,
                  "Completed Quizzes"
                )}
              </div>

              {/* Progress Bar for Perfect Quizes */}
              <div className="row">
              <LevelPic value={Math.floor(this.state.perfectQuizCount / 5)} />
                {generateProgress(
                  this.state.perfectQuizCount,
                  5,
                  "Too Easy! Perfect Quiz"
                )}
              </div>

              {/* Progress Bar for # Decks*/}
              <div className="row">
              <LevelPic value={Math.floor(this.state.deckSize / 10)} />
                {generateProgress(this.state.deckSize, 10, "Number of Decks")}
              </div>

              {/* Progress Bar for Quizes TBD*/}
              <div className="row">
              <LevelPic value={Math.floor(this.state.overXPCount / 5)} />
                {generateProgress(
                  this.state.overXPCount,
                  5,
                  ">300XP in One Quiz"
                )}
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

function calcLevel(points, increment) {
  var o = {};
  o.level = Math.floor(points / increment);
  o.denom = (o.level + 1) * increment;
  o.progress = ((points % increment) / increment) * 100;
  return o;
}

function generateProgress(points, increment, title) {
  var o = calcLevel(points, increment);

  return (
    <ProgressBar
      title={title}
      num={points}
      denom={o.denom}
      progress={o.progress}
    />
  );
}

export default Achievements;
