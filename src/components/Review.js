import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth } from "../config/firebase";
import Card from "./cards/Card";

class Review extends Component {
  constructor() {
    super();
    this.unsubscribe = null;

    this.ref = firebase.firestore().collection("flashcards");
    this.query = this.ref.where("capital", "==", true);

    const cards = [];

    this.state = {
      cards: cards,
      user: null,
      english: "",
      pinyin: "",
      hanzi: "",
      deckid: "",
      title: "",
      currentCard: {},
      count: 0
    };
  }

  onCollectionUpdate = querySnapshot => {
    //cards
    const cards = [];

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
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  handleClick = () => {
    this.setState(({ count }) => ({
      count: count + 1
    }));
  };

  render() {
    const { id } = this.props.location.state;

    if (typeof this.state.cards[this.state.count] !== "undefined") {
      // console.log(this.state.cards[0]["english"]);
      return (
        <div>
          <div className="container">
            <div className="back-button">
              <Link
                to={{
                  pathname: "/deck/" + id,
                  state: { id: id }
                }}
              >
                <button className="btn-floating btn-large waves-effect waves-light blue">
                  <i className="material-icons">arrow_back</i>
                </button>
              </Link>
            </div>
          </div>

          <div className="container">
            <Card
              eng={this.state.cards[this.state.count]["english"]}
              han={this.state.cards[this.state.count]["hanzi"]}
              pin={this.state.cards[this.state.count]["pinyin"]}
            />
          </div>
          <div className="clear-10" />
          <div>
            <div className="button-container">
              <button className="btn" onClick={this.handleClick}>
                Last
              </button>
              <button className="btn" onClick={this.handleClick}>
                Next
              </button>
            </div>
            <div className="button-container">
              <button className="btn">Easy</button>
              <button className="btn">Good</button>
              <button className="btn">Okay</button>
              <button className="btn">Hard</button>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default Review;
