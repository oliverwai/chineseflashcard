import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth } from "../../config/firebase.js";
import ProgressBar from "react-bootstrap/ProgressBar";

// replace this w/ flashcard info
// @TODO: create crud app w/ table flashcards
// then create a review for today's cards
class DeckDetails extends Component {
  constructor() {
    super();
    this.unsubscribe = null;

    this.ref = firebase.firestore().collection("flashcards");
    this.deckref = firebase.firestore().collection("decks");

    this.state = {
      cards: [],
      user: null,
      currentcard: "",
      english: "",
      pinyin: "",
      hanzi: "",
      deckid: "",
      title: "",
      sm: 0
    };
  }

  onSubmit = e => {
    e.preventDefault();

    const id = this.props.location.state.id;
    const { english, pinyin, hanzi, deckid, sm } = this.state;
    const uid = firebase.auth().currentUser.uid;
    const cardCreateDate = Date.now();
    const nextReviewDate = Date.now();
    this.ref
      .add({
        english,
        pinyin,
        hanzi,
        deckid,
        sm,
        uid,
        cardCreateDate,
        nextReviewDate
      })
      .then(docRef => {
        this.setState({
          english: "",
          pinyin: "",
          hanzi: "",
          deckid: id,
          sm: 0
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
    //cards
    const cards = [];
    //const id = this.props.location.state;

    this.ref
      .where("deckid", "==", this.state.deckid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const { english, pinyin, hanzi, deckid } = doc.data();
          cards.push({
            key: doc.id,
            doc, // DocumentSnapshot
            english,
            pinyin,
            hanzi,
            deckid
          });
        });
        this.setState({
          cards
        });
      });
  };

  componentDidMount() {
    const { id } = this.props.location.state;
    if (id) {
      this.setState({ deckid: id });
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    const cards = [];
    //const id = this.props.location.state;

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  delete(id) {
    // console.log(id);
    firebase
      .firestore()
      .collection("flashcards")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }

  render() {
    const { id } = this.props.location.state;

    return (
      <div class="container">
        <div class="row">
          {/* LEFTMOST COL */}
          <div class="col s3">
            {/* BACK BUTTON */}
            <div class="row">
              <Link
                to={{
                  pathname: "/"
                }}
              >
                <button class="btn-floating btn-large waves-effect waves-light blue">
                  <i class="material-icons">arrow_back</i>
                </button>
              </Link>
            </div>

            {/* ADD FORM */}
            <div className="add-deck">
              <form onSubmit={this.onSubmit}>
                <div class="form-group">
                  <label for="english">English:</label>
                  <input
                    type="text"
                    class="form-control"
                    name="english"
                    value={this.state.english}
                    onChange={this.onChange}
                    placeholder="English"
                  />
                </div>
                <div class="form-group">
                  <label for="pinyin">Pinyin:</label>
                  <input
                    type="text"
                    class="form-control"
                    name="pinyin"
                    value={this.state.pinyin}
                    onChange={this.onChange}
                    placeholder="Pinyin"
                  />
                </div>
                <div class="form-group">
                  <label for="hanzi">Chinese:</label>
                  <input
                    type="text"
                    class="form-control"
                    name="hanzi"
                    value={this.state.hanzi}
                    onChange={this.onChange}
                    placeholder="Chinese"
                  />
                </div>
                <button class="btn blue">Add Card</button>
              </form>
            </div>
          </div>

          {/* RIGHTMOST COLUMN */}
          <div class="col s7 pull-s3">
            <div className="row">
              <div class="text-left">
                <Link
                  to={{
                    pathname: "/review/" + id,
                    state: { id: id }
                  }}
                >
                  <button class="btn">Review</button>
                </Link>
              </div>
            </div>

            <div className="row">
              <div className="col s7">
                <div class="panel-heading">
                  <h3 class="panel-title">Cards</h3>
                </div>
                <div class="panel-body">
                  <table class="table table-stripe">
                    <thead>
                      <tr>
                        <th>English</th>
                        <th>Pinyin</th>
                        <th>Chinese</th>
                        <th> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.cards.map(card => (
                        <tr key={card.id}>
                          <td>{card.english}</td>
                          <td>{card.pinyin}</td>
                          <td>{card.hanzi}</td>
                          <td>
                            <div className="left">
                              <button
                                onClick={this.delete.bind(this, card.key)}
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
        </div>
      </div>
    );
  }
}

export default DeckDetails;
