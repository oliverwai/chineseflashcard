import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider } from "./config/firebase.js";

class App extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
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

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider).then(function(result) {
      var user = result.user;
      this.setState({
        user
      });
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
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
            {this.state.user ? (
              <button onClick={this.logout}>Log Out</button>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
          </div>
        </header>
        <div className="container">
          <section className="add-deck">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="What's your name?"
                onChange={this.handleChange}
                value={this.state.username}
              />
              <input
                type="text"
                name="currentdeck"
                placeholder="What are you bringing?"
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
                      <p>
                        brought by: {deck.user}
                        <button onClick={() => this.removedeck(deck.id)}>
                          Remove deck
                        </button>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
