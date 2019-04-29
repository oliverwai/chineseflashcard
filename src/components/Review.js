import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase, { auth } from "../config/firebase";
import Card from "./cards/Card";
import ProgressBar from "./gamification/ProgressBar";
import points from "./img/points.png";
import perfect from "./img/perfect.png";
import completed from "./img/completed.png";
import overpoints from "./img/overpoints.png";

class Review extends Component {
  constructor() {
    super();
    this.unsubscribe = null;

    this.ref = firebase.firestore().collection("flashcards");
    this.userRef = firebase.firestore().collection("users");

    const cards = [];

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
      alreadyChecked: false,
      finished: false,
      newPoints: 0,
      allPerfect: true
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

  // Increments the completedQuiz counter in Users
  updateDeckComplete = () => {
    var over300xp = this.state.newPoints >= 300;
    var tempRef = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid);
    tempRef.update({
      doneQuizCount: firebase.firestore.FieldValue.increment(1),
      // below returns 1 if true 0 if false
      perfectQuizCount: firebase.firestore.FieldValue.increment(
        Number(this.state.allPerfect)
      ),
      overXPCount: firebase.firestore.FieldValue.increment(Number(over300xp))
    });
  };

  componentDidMount() {
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
    const secondsInDay = 60 * 60 * 24 * 1000;
    var now = Date.now();
    o.nextReviewDate = now + secondsInDay * o.interval;

    // WRITE TO DB AND MOVE TO NEXT CARD
    docRef.update(o);
    if (this.state.count < this.state.cards.length - 1) {
      this.setState({
        count: this.state.count + 1
      });
    }
    if (this.state.count === this.state.cards.length - 1) {
      this.setState({
        finished: true
      });
    }
    var updatepoints = quality * 10;
    // POST POINTS TO DB
    var userRef = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid);
    userRef.update({
      points: firebase.firestore.FieldValue.increment(updatepoints)
    });

    var newPoints = this.state.newPoints + updatepoints;

    if (quality < 5) {
      this.setState({
        allPerfect: false
      });
    }
    this.setState({
      newPoints
    });
  };

  // TAKES IN CURRENT SRS SCORE, CARD ID, BUTTON PRESS, CALCS NEW SCORE

  render() {
    const { id } = this.props.location.state;
    const num = this.state.count + 1;
    const denom = this.state.cards.length;
    const progress = (num / denom) * 100;
    const title = "Review Progress";
    var currentCard = this.state.cards[this.state.count];
    console.log(this.state.cards.length);

    if (
      typeof this.state.cards[this.state.count] !== "undefined" &&
      !this.state.finished
    ) {
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
                <ProgressBar
                  num={num}
                  denom={denom}
                  progress={progress}
                  title={title}
                />
              </div>

              {/* FLASHCARD */}
              <div className="row">
                <Card
                  eng={currentCard["english"]}
                  han={currentCard["hanzi"]}
                  pin={currentCard["pinyin"]}
                />
              </div>
              {/* SRS BUTTONS WITH SELECTED ANSWER SOL PASSED ON*/}
              <div className="row">
                <div className="col s6 text-center">
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 5);
                    }}
                  >
                    Easy
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 4);
                    }}
                  >
                    {" "}
                    Good
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 3);
                    }}
                  >
                    {" "}
                    Okay
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 2);
                    }}
                  >
                    {" "}
                    Hard
                  </button>
                  <button
                    className="btn"
                    onClick={e => {
                      this.handleNext(e, currentCard, 1);
                    }}
                  >
                    {" "}
                    Fail
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
    }

    // WHEN DONE WITH ALL THE FLASHCARDS UNIQUE SCENARIO
    // INCREMENT USER # REVIEWS DONE BY 1 in users collection
    // SHOW CONGRATS IMAGE
    // BACK BUTTON TO DECK
    else if (this.state.finished) {
      this.updateDeckComplete();
      return (
        <div className="container">
          <div className="complete">
            <h3 className="centered clear-20">
              {this.state.allPerfect ? "Perfect!" : "All Done!"}
            </h3>
            <div className="row">
              <img src={points} style={{ width: 80, height: 80 }} alt="badge" />
              <h3 className="left clear-20">+{this.state.newPoints} Points</h3>
            </div>
            <div className="row">
              <img
                src={completed}
                style={{ width: 80, height: 80 }}
                alt="badge"
              />
              <h3 className="left clear-20">+1 Quiz Complete</h3>
            </div>

            {isPerfect(this.state.allPerfect)}
            {isoverXP(this.state.newPoints > 300)}

            <div className="centered clear-20">
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
        </div>
      );
    }

    // NOTHING TO REVIEW
    else {
      return (
        <div className="container">
          <div className="complete">
            <h3 className="centered clear-20">Nothing to Review!</h3>
            <div className="centered clear-20">
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
        </div>
      );
    }
  }
}

function isPerfect(allPerfect) {
  if (allPerfect) {
    return (
      <div className="row">
        <img src={perfect} style={{ width: 80, height: 80 }} alt="badge" />
        <h3 className="left clear-20">+1 Too Easy! Perfect Quiz</h3>
      </div>
    );
  }
}

function isoverXP(overXP) {
  if (overXP) {
    return (
      <div className="row">
        <img src={overpoints} style={{ width: 80, height: 80 }} alt="badge" />
        <h3 className="left clear-20">+1 More than 300 Points</h3>
      </div>
    );
  }
}

export default Review;
