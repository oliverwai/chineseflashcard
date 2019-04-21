import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth } from "../config/firebase";
import Card from "./cards/Card";

class Review extends Component {
  constructor() {
    super();
    this.unsubscribe = null;

    this.ref = firebase.firestore().collection("flashcards");

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

  onCollectionUpdate = () => {
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

  handleNext = () => {
    if (this.state.count < this.state.cards.length - 1) {
      this.setState(({ count }) => ({
        count: count + 1
      }));
    }
  };

  handlePrev = () => {
    if (this.state.count > 0) {
      this.setState(({ count }) => ({
        count: count - 1
      }));
    }
  };

  // TAKES IN CURRENT SRS SCORE, CARD ID, BUTTON PRESS, CALCS NEW SCORE

  render() {
    const { id } = this.props.location.state;
    const num = this.state.count + 1;
    const denom = this.state.cards.length;
    const progress = (num / denom) * 100;

    if (typeof this.state.cards[this.state.count] !== "undefined") {
      // console.log(this.state.cards[0]["english"]);
      return (
        <div className="container" style={{}}>
          {/* Back Row */}
          <div className="row">
            <div className="col s3">
              <div className="">
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

            {/* MAIN SECTION */}
            <div className="col s6 valign pull-s3">
              {/* PROGRESSBAR */}
              <div className="row">
                <div className="col s6">
                  <div className="row">
                    <h5 className="col s3 left-align">Review Progress</h5>
                    <h5 className="col s3 right-align">
                      {num} / {denom}
                    </h5>
                  </div>
                  <div className="progress progressBar">
                    <div
                      className="determinate"
                      style={{ width: progress + "%" }}
                    />
                  </div>
                </div>
              </div>

              {/* PROGRESSBAR */}
              <div className="row">
                <Card
                  eng={this.state.cards[this.state.count]["english"]}
                  han={this.state.cards[this.state.count]["hanzi"]}
                  pin={this.state.cards[this.state.count]["pinyin"]}
                />
              </div>

              {/* PREV NEXT BUTTONS */}
              <div className="row">
                <div className="col s6 text-center">
                  <button
                    className="waves-effect waves-light btn"
                    onClick={this.handlePrev}
                  >
                    Last
                  </button>
                  <button
                    className="waves-effect waves-light btn"
                    onClick={this.handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* SRS BUTTONS */}
              <div className="row">
                <div className="col s6 text-center">
                  <button className="btn">Easy</button>
                  <button className="btn">Good</button>
                  <button className="btn">Okay</button>
                  <button className="btn">Hard</button>
                </div>
              </div>
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
