import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../config/firebase.js";
import ProgressBar from "react-bootstrap/ProgressBar";

// replace this w/ flashcard info
// @TODO: create crud app w/ table flashcards
// then create a review for today's cards
class DeckDetails extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    const { id } = this.props.location.state;
    return (
      <div className="container section deck-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <span className="card-title">{id} </span>
            <ProgressBar active now={60} />
            <p>lorem</p>
          </div>
        </div>
      </div>
    );
  }
}

export default DeckDetails;
