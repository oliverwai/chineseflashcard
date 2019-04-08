import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase, {auth} from "../../config/firebase.js";
import ProgressBar from "react-bootstrap/ProgressBar";

// replace this w/ flashcard info
// @TODO: create crud app w/ table flashcards
// then create a review for today's cards
class DeckDetails extends Component {
  constructor() {
    super();
    this.unsubscribe = null;

    this.ref = firebase.firestore().collection("flashcards");
    this.state ={
      cards: [],
      user: null,
      currentcard: "",
      english: "",
      pinyin: "",
      hanzi: "",
      deckid: ""
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const id = this.props.location.state.id;
    const { english, pinyin, hanzi, deckid} = this.state;
    
    this.ref
      .add({
        english,
        pinyin,
        hanzi,
        deckid,
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
          deckid,
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
     if(id){
       this.setState({deckid: id});
     }

      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

  render() {
    const { id } = this.props.location.state;
    return (
    <div class="container">
        <section className="add-deck">
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
              <button>Add Card</button>
            </form>
          </section>
        <section className="display-deck">
          <div class="panel-heading">
            <h3 class="panel-title">{id}</h3>
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
                {this.state.cards.filter(card => card.deckid === id).map(card => (
                  <tr key = {card.id}>
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
    );
  }
}

export default DeckDetails;
