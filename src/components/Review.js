import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth } from "../config/firebase";
import Card from "./cards/Card";
import ProgressBar from "./gamification/ProgressBar";

class Review extends Component {
  constructor() {
    super();
    this.unsubscribe = null;

    this.ref = firebase.firestore().collection("flashcards");

    const cards = [];
    const alreadyChecked = false;

    this.state = {
      cards: cards,
      user: null,
      english: "",
      pinyin: "",
      hanzi: "",
      deckid: "",
      title: "",
      ef: -1,
      interval: -1,
      nextreviewdate: -1,
      count: 0,
      alreadyChecked
    };
  }

  onCollectionUpdate = () => {
    //cards
    const cards = [];
    if (!this.state.alreadyChecked) {
      this.ref
        .where("deckid", "==", this.state.deckid)
        // Can change this line to nextReviewDate but ... not working
        .where("nextReviewDate", "<=", Date.now())
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {
              english,
              pinyin,
              hanzi,
              deckid,
              ef,
              interval,
              nextreviewdate,
              repetition
            } = doc.data();
            cards.push({
              key: doc.id,
              doc, // DocumentSnapshot
              english,
              pinyin,
              hanzi,
              deckid,
              ef,
              interval,
              nextreviewdate,
              repetition
            });
          });
          this.setState({
            cards,
            alreadyChecked: true
          });
        });
    }
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

  componentWillUnmount() {
    this.mounted = false;
  }

  // Calculates all the SRS stuff
  handleNext = (e, currentCard, quality) => {
    var docRef = this.ref.doc(currentCard.key);
    var o = {};

    // CALCULATE EF
    o.ef = Math.max(
      1.3,
      currentCard.ef + (0.1 - (5.0 - quality)) * (0.08 + (5.0 - quality) * 0.02)
    );

    //repetition
    if (quality < 3) {
      o.repetition = 0;
    } else {
      o.repetition = currentCard.repetition + 1;
    }

    // interval
    if (o.repetition <= 1) {
      o.interval = 1;
    } else if (o.repetition === 2) {
      o.interval = 6;
    } else {
      o.interval = Math.max(Math.round(o.interval * o.ef, 0));
    }

    // calculate next day to review
    const secondsInDay = 60 * 60 * 24;
    var now = Date.now();
    o.nextReviewDate = now + secondsInDay * o.interval;

    // WRITE TO DB AND MOVE TO NEXT CARD
    docRef.update(o);
    if (this.state.count < this.state.cards.length - 1) {
      this.setState({
        count: this.state.count + 1
      });
    }
    console.log(this.props.location.state);
    // FIX THIS WHAT TO DO WHEN DONE
    if (this.state.count === this.state.cards.length - 1) {
      this.props.history.push("/");
    }
  };

  // handlePrev = () => {
  //   if (this.state.count > 0) {
  //     this.setState(({ count }) => ({
  //       count: count - 1
  //     }));
  //   }
  // };

  // TAKES IN CURRENT SRS SCORE, CARD ID, BUTTON PRESS, CALCS NEW SCORE

  render() {
    const { id } = this.props.location.state;
    const num = this.state.count + 1;
    const denom = this.state.cards.length;
    const progress = (num / denom) * 100;
    var currentCard = this.state.cards[this.state.count];
    console.log(this.state.cards.length);

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
                <ProgressBar num={num} denom={denom} progress={progress} />
              </div>

              {/* FLASHCARD */}
              <div className="row">
                <Card
                  eng={currentCard["english"]}
                  han={currentCard["hanzi"]}
                  pin={currentCard["pinyin"]}
                />
              </div>

              {/* PREV NEXT BUTTONS */}
              {/* <div className="row">
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
              </div> */}

              {/* SRS BUTTONS */}
              <div className="row">
                <div className="col s6 text-center">
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 4);
                    }}
                  >
                    Easy
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 3);
                    }}
                  >
                    {" "}
                    Good
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 2);
                    }}
                  >
                    {" "}
                    Okay
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 1);
                    }}
                  >
                    {" "}
                    Hard
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 0);
                    }}
                  >
                    {" "}
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
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
      );
    }
  }
}

export default Review;
