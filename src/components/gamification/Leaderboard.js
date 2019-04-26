import React, { Component } from "react";
import firebase from "../../config/firebase.js";
import Table from "react-bootstrap/Table";
import crown from "../img/crown.png";
import { Link } from "react-router-dom";

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
      <div class="container" style={{ width: "50%" }}>
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

        <div className="row">
          <div className="col display-deck centered">
            <div className="panel-heading">
              <img src={crown} alt="icon" />

              <h3 className="panel-title">LEADERBOARD</h3>
            </div>
            <div className="panel-body centered">
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
