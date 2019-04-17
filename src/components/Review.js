import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth } from "../config/firebase";

class Review extends Component {
  constructor() {
    super();
    this.unsubscribe = null;

    this.ref = firebase.firestore().collection("flashcards");
    this.query = this.ref.where("capital", "==", true);

    this.state = {
      cards: [],
      user: null,
      currentcard: "",
      english: "",
      pinyin: "",
      hanzi: "",
      deckid: "",
      title: "",
      currentCard: {}
    };
  }

  onCollectionUpdate = querySnapshot => {
    //cards
    const cards = [];
    //const id = this.props.location.state;
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
  };

  componentDidMount() {
    /*
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
    */
    const { id } = this.props.location.state;
    if (id) {
      this.setState({ deckid: id });
    }

    const cards = [];
    //const id = this.props.location.state;

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    const { id } = this.props.location.state;

    return (
      // Back Button Layer
      <div>
        <div class="container">
          <div class="back-button">
            <Link
              to={{
                pathname: "/deck/" + id,
                state: { id: id }
              }}
            >
              <button class="btn-floating btn-large waves-effect waves-light blue">
                <i class="material-icons">arrow_back</i>
              </button>
            </Link>
          </div>
        </div>

        {/* Flashcard Layer */}
        <div class="container">
          <section className="display-deck">
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
                  </tr>
                </thead>
                <tbody>
                  {this.state.cards
                    .filter(card => card.deckid === id)
                    .map(card => (
                      <tr key={card.id}>
                        <td>{card.english}</td>
                        <td>{card.pinyin}</td>
                        <td>{card.hanzi}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Review;
