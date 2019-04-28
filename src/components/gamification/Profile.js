import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth, provider } from "../../config/firebase.js";
import fire from "../img/firestreak.png"; // Tell Webpack this JS file uses this image
import ProgressBar from "./ProgressBar";
import ProfilePic from "./ProfilePic";

// replace this w/ flashcard info
// @TODO: create crud app w/ table flashcards
// then create a review for today's cards
class Profile extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("users");

    this.state = {
      user: null,
      uid: null,
      points: 0,
      displayName: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        const uid = firebase.auth().currentUser.uid;

        var docRef = this.ref.doc(uid);
        docRef.get().then(doc => {
          const {
            displayName,
            points,
          } = doc.data();
          this.setState({
            user,
            uid,
            displayName,
            points,
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
            <div>
              {/* MAIN COLUMN */}
              <div className="col s12">
                <div>
                  <ProfilePic value={level} />
                </div>
                <div>
                  <h5 className="centered">{this.state.displayName}</h5>
                </div>
                <div>
                  <h5 className="centered">Level: {level}</h5>
                </div>
                <div>
                    <h5 className="centered">Points: {this.state.points}</h5>
              </div>
              </div>
            </div>
          ) : (
            <div className="wrapper">
              <p>You must be logged in to see your Profile</p>
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

export default Profile;