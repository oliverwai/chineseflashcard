import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../config/firebase.js";
import Table from "react-bootstrap/Table";
import crown from "../img/crown.png";

// replace this w/ flashcard info
class DeckDetails extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("users");
    this.state = {
      leader: [],
      dsiplayName: "",
      points: 0
    };
  }

  // unshift moves the item the front, so highest point =top
  onCollectionUpdate = querySnapshot => {
    const leader = [];
    querySnapshot.forEach(doc => {
      const { displayName, points } = doc.data();
      const level = Math.floor(points / 1000);
      leader.unshift({
        level,
        key: doc.id,
        doc, // DocumentSnapshot
        displayName,
        points
      });
    });
    this.setState({
      leader
    });
  };

  componentDidMount() {
    this.unsubscribe = this.ref
      .orderBy("points")
      .onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (
      <div class="container">
        <div className="row">
          <div className="display-deck centered">
            <div class="panel-heading">
              <img src={crown} alt="icon" />

              <h3 class="panel-title">LEADERBOARD</h3>
            </div>
            <div class="panel-body centered">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.leader.map(leader => (
                    <tr>
                      <td className="tdcenter">{leader.level}</td>
                      <td className="tdcenter">{leader.displayName}</td>
                      <td className="tdcenter">{leader.points}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeckDetails;
