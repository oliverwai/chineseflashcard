import React, { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor() {
    super();
    this.ref = firebase.database().ref('decks');
    this.unsubscribe = null;
    this.state = {
      currentdeck: "",
      username: "",
      decks: [],
      user: null
    };
    //this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }
  /*
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
*/
  onCollectionUpdate = (querySnapshot) => {
    const decks = [];
    querySnapshot.forEach((doc) => {
      const { title, description, author } = doc.data();
      decks.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        author,
      });
    });
    this.setState({
      decks
   });
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });

    this.unsubscribe = this.ref.on("value", snapshot => {
      this.unsubscribe = this.onCollectionUpdate;
    });
    //this.ref.off(this.onCollectionUpdate);
    //this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    /*
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
    */
  }

  /*
  removedeck(deckId) {
    const deckRef = firebase.database().ref(`/decks/${deckId}`);
    deckRef.remove();
  }
  */
  render() {

    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              BOARD LIST
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/create">Add Board</Link></h4>
            <table class="table table-stripe">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                {this.state.decks.map(deck =>
                  <tr>
                    <td><Link to={`/show/${deck.key}`}>{deck.title}</Link></td>
                    <td>{deck.description}</td>
                    <td>{deck.author}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );


    /*
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
    */
  }
}
export default Dashboard;
