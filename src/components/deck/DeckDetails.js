import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../config/firebase.js";

// replace this w/ flashcard info
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
            <p>lorem</p>
          </div>
        </div>
      </div>
    );
  }
}

export default DeckDetails;
