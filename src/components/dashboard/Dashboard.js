import React, { Component } from "react";
import firebase, { auth, provider } from "../../config/firebase.js";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("decks");
    this.unsubscribe = null;
    // const uid= firebase.auth().currentUser.uid
    this.state = {
      currentdeck: "",
      username: "",
      decks: [],
      user: null,
      title: "",
      description: "",
      uid: null,
      reviewCount: -1
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

    const { title, description, uid } = this.state;
    this.ref
      .add({
        title,
        description,
        uid
      })
      .then(docRef => {
        this.setState({
          title: "",
          description: ""
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

  // Only pulls deck associated with user based on uid
  onCollectionUpdate = querySnapshot => {
    const decks = [];
    this.ref
      .where("uid", "==", this.state.uid)
      .get()
      .then(querySnapshot => {
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
      });
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        this.setState({ uid: firebase.auth().currentUser.uid });
        this.onCollectionUpdate();
        // console.log(this.state.uid)
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

  // Delete Deck
  delete(id) {
    firebase
      .firestore()
      .collection("decks")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");

        // This part deletes all the associate flashcards
        firebase
          .firestore()
          .collection("flashcards")
          .where("deckid", "==", id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              firebase
                .firestore()
                .collection("flashcards")
                .doc(doc.id)
                .delete();
            });
          });

        this.props.history.push("/");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }

  /*
  removedeck(deckId) {
    const deckRef = firebase.database().ref(`/decks/${deckId}`);
    deckRef.remove();
  }
  */
  render() {
    return (
      <div>
        {this.state.user ? (
          <div className="container">
            <div className="row">
              {/* LEFTMOST COLUMN */}
              <div className="col s3">
                {/* ADD DECK FORM */}
                <div row>
                  <div className="add-deck">
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label for="title">Title:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={this.state.title}
                          onChange={this.onChange}
                          placeholder="Title"
                        />
                      </div>
                      <div className="form-group">
                        <label for="description">Description:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={this.state.description}
                          onChange={this.onChange}
                          placeholder="Description"
                        />
                      </div>
                      <button className="btn blue">Add Deck</button>
                    </form>
                  </div>
                </div>
              </div>

              {/* RIGHTMOST COLUMN */}
              <div className="col s7 pull-s3">
                {/* DECKLIST */}
                <div className="panel-heading clear-10">
                  <h3 className="panel-title">DECK LIST</h3>
                </div>
                <div className="panel-body">
                  <table className="highlight">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.decks.map(deck => (
                        <tr>
                          <td>
                            <Link
                              to={{
                                pathname: "/deck/" + deck.key,
                                state: {
                                  id: deck.key,
                                  user: this.state.user.id,
                                  title: deck.title
                                }
                              }}
                            >
                              {deck.title}
                            </Link>
                          </td>
                          <td>{deck.description}</td>
                          <td>
                            <div className="left">
                              <button
                                onClick={this.delete.bind(this, deck.key)}
                                className="btn btn-danger"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>You must be logged in to see your deck list and add to it</p>
          </div>
        )}
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
