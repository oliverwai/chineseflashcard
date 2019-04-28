import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth } from "../../config/firebase.js";
import Profile from "../gamification/Profile.js";

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
      title: ""
    };
  }

  onSubmit = e => {
    e.preventDefault();

    const id = this.props.location.state.id;
    const { english, pinyin, hanzi, deckid } = this.state;
    const uid = firebase.auth().currentUser.uid;
    const cardCreateDate = Date.now();
    const nextReviewDate = Date.now();
    const interval = 1;
    const ef = 2.5;
    const repetition = 0;
    this.ref
      .add({
        english,
        pinyin,
        hanzi,
        deckid,
        uid,
        cardCreateDate,
        nextReviewDate,
        interval,
        ef,
        repetition
      })
      .then(docRef => {
        this.setState({
          english: "",
          pinyin: "",
          hanzi: "",
          deckid: id
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
          const { english, pinyin, hanzi, deckid, nextReviewDate } = doc.data();
          cards.push({
            key: doc.id,
            doc, // DocumentSnapshot
            english,
            pinyin,
            hanzi,
            deckid,
            nextReviewDate
          });
        });
        this.setState({
          cards
        });
      });
  };

  // Renders what the Review Tab of the Table says
  renderYesNo(props) {
    var currentTime = Date.now();
    var secondDiff = (props.nextReviewDate - currentTime) / 1000;
    if (props.nextReviewDate < currentTime) {
      return "Now";
    } else {
      var days = Math.floor(secondDiff / (24 * 60 * 60));
      var hours = Math.floor((secondDiff % (24 * 60 * 60)) / 3600);
      var minutes = Math.floor((secondDiff % 3600) / 60);
      return (
        <p>
          {days}D:{hours}H:{minutes}M
        </p>
      );
    }
  }

  componentDidMount() {
    const { id } = this.props.location.state;
    if (id) {
      firebase
        .firestore()
        .collection("decks")
        .doc(id)
        .get()
        .then(doc => {
          const { title } = doc.data();
          this.setState({ deckid: id, title });
          this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
        });
    }

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  // Delete flashcard
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
        <div className="container">
          <div className="row">
            {/* LEFTMOST COL */}
            <div className="col s3">
              {/* BACK BUTTON */}
              <div className="row">
                <Link
                  to={{
                    pathname: "/"
                  }}
                >
                  <button className="btn-floating btn-large waves-effect waves-light blue">
                    <i className="material-icons">arrow_back</i>
                  </button>
                </Link>
              </div>

              {/* ADD FORM */}
              <div className="add-deck">
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label>English:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="english"
                      value={this.state.english}
                      onChange={this.onChange}
                      placeholder="English"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pinyin:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pinyin"
                      value={this.state.pinyin}
                      onChange={this.onChange}
                      placeholder="Pinyin"
                    />
                  </div>
                  <div className="form-group">
                    <label>Chinese:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="hanzi"
                      value={this.state.hanzi}
                      onChange={this.onChange}
                      placeholder="Chinese"
                    />
                  </div>
                  <button className="btn blue">Add Card</button>
                </form>
              </div>
            </div>

            {/* RIGHTMOST COLUMN */}
            <div className="col s7">
              {/* Title */}
              <div className="row">
                <div className="panel-heading">
                  <h3 className="panel-title">{this.state.title}</h3>
                </div>
              </div>
              <div className="row">
                <div className="text-left">
                  <Link
                    to={{
                      pathname: "/review/" + id,
                      state: { id: id }
                    }}
                  >
                    <button className="btn">Review</button>
                  </Link>
                </div>
              </div>

              <div className="row">
                <div className="col s7">
                  <div className="panel-body">
                    <table className="table table-stripe">
                      <thead>
                        <tr>
                          <th>English</th>
                          <th>Pinyin</th>
                          <th>Chinese</th>
                          <th>Review</th>
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
                              {this.renderYesNo({
                                nextReviewDate: card.nextReviewDate
                              })}
                            </td>
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
            <div className="col s2">
                <div className="profile">
                  <Profile/>
                </div>
              </div>
          </div>
        </div>
    );
  }
}

export default DeckDetails;
