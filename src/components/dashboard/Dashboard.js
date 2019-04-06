import React, { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      currentdeck: "",
      username: "",
      decks: [],
      user: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const decksRef = firebase.database().ref("decks");
    const deck = {
      title: this.state.currentdeck,
      user: this.state.username
    };
    decksRef.push(deck);
    this.setState({
      currentdeck: "",
      username: ""
    });
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });

    const decksRef = firebase.database().ref("decks");
    decksRef.on("value", snapshot => {
      let decks = snapshot.val();
      let newState = [];
      for (let deck in decks) {
        newState.push({
          id: deck,
          title: decks[deck].title,
          user: decks[deck].user
        });
      }
      this.setState({
        decks: newState
      });
    });
  }

  removedeck(deckId) {
    const deckRef = firebase.database().ref(`/decks/${deckId}`);
    deckRef.remove();
  }
  render() {
    return (
      <div className="app">
        {this.state.user ? (
          <div>
            <div className="container">
              <section className="add-deck">
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    name="username"
                    placeholder="Deck Name"
                    onChange={this.handleChange}
                    value={this.state.username}
                  />
                  <input
                    type="text"
                    name="currentdeck"
                    placeholder="Deck Info"
                    onChange={this.handleChange}
                    value={this.state.currentdeck}
                  />
                  <button>Add Deck</button>
                </form>
              </section>
              <section className="display-deck">
                <div className="wrapper">
                  <ul>
                    {this.state.decks.map(deck => {
                      return (
                        <li key={deck.id}>
                          <h3>{deck.title}</h3>
                          <p>brought by: {deck.user}</p>
                          <div>
                            <button onClick={() => this.removedeck(deck.id)}>
                              Remove
                            </button>
                            <Link
                              to={{
                                pathname: "/deck/" + deck.id,
                                state: { id: deck.id }
                              }}
                              key={deck.id}
                              className="link"
                            >
                              <button>View</button>
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>You must be logged in to see your deck list and add to it</p>
          </div>
        )}
      </div>
    );
  }
}
export default Dashboard;
