import React, { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("decks");
    this.unsubscribe = null;
    this.state = {
      currentdeck: "",
      username: "",
      decks: [],
      user: null,
      title: "",
      description: "",
      author: ""
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
 onSubmit = e => {
  e.preventDefault();

  const { title, description, author } = this.state;

  this.ref
    .add({
      title,
      description,
      author
    })
    .then(docRef => {
      this.setState({
        title: "",
        description: "",
        author: ""
      });
      //this.props.history.push("/");
    })
    .catch(error => {
      console.error("Error adding document: ", error);
    });
  };

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onCollectionUpdate = querySnapshot => {
    const decks = [];
    querySnapshot.forEach(doc => {
      const { title, description, author } = doc.data();
      decks.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        author
      });
    });
    this.setState({
      decks
    });
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);

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
        <section className="add-deck">
          <form onSubmit={this.onSubmit}>
                <div class="form-group">
                  <label for="title">Title:</label>
                  <input
                    type="text"
                    class="form-control"
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                    placeholder="Title"
                  />
                </div>
                <div class="form-group">
                  <label for="description">Description:</label>
                  <textArea
                    class="form-control"
                    name="description"
                    onChange={this.onChange}
                    placeholder="Description"
                    cols="80"
                    rows="3"
                  >
                    {this.state.description}
                  </textArea>
                </div>
                <div class="form-group">
                  <label for="author">Author:</label>
                  <input
                    type="text"
                    class="form-control"
                    name="author"
                    value={this.state.author}
                    onChange={this.onChange}
                    placeholder="Author"
                  />
                </div>
              <button>Add Deck</button>
            </form>
          </section>
        <section className="display-deck">
          <div class="panel-heading">
            <h3 class="panel-title">DECK LIST</h3>
          </div>
          <div class="panel-body">
            <table class="table table-stripe">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                {this.state.decks.map(deck => (
                  <tr>
                    <td>
                      <Link
                        to={{
                          pathname: "/deck/" + deck.key,
                          state: { id: deck.key }
                        }}
                      >
                        {deck.title}
                      </Link>
                    </td>
                    <td>{deck.description}</td>
                    <td>{deck.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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
