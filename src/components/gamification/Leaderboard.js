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
      <div className="wrapper">
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
              <td>3218</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Ben</td>
              <td>1402</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Jon</td>
              <td>8702</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default DeckDetails;
