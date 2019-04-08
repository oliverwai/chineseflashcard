import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../config/firebase.js";
import Table from "react-bootstrap/Table";

// replace this w/ flashcard info
class DeckDetails extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

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
                  <th>#</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Oli</td>
                  <td>3500</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Ben</td>
                  <td>1200</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Jon</td>
                  <td>800</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </section>
      </div>
    );
  }
}

export default DeckDetails;
