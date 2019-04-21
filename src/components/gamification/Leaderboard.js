import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../config/firebase.js";
import Table from "react-bootstrap/Table";

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

  onCollectionUpdate = querySnapshot => {
    const leader = [];

    querySnapshot.forEach(doc => {
      const { displayName, points } = doc.data();
      leader.unshift({
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
        <section className="display-deck">
          <div class="panel-heading">
            <h3 class="panel-title">LEADERBOARD</h3>
          </div>
          <div class="panel-body">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {this.state.leader.map(leader => (
                  <tr>
                    <td>{leader.displayName}</td>
                    <td>{leader.points}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      </div>
    );
  }
}

export default DeckDetails;
