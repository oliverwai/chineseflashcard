import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase, { auth } from "../config/firebase";

// replace this w/ flashcard info
// @TODO: create crud app w/ table flashcards
// then create a review for today's cards
const questions = ["一", "二", "三", "四", "五"];
const answers = ["yī", "èr", "sān", "sì", "wǔ"];
function getCount() {
  return questions.length;
}
function getQuestion(i) {
  return (
    <div>
      <span>{questions[i - 1]}</span>
    </div>
  );
}
function getAnswer(i) {
  return answers[i - 1];
}
// the actual quiz is done, boring stuff follows...

class Review extends Component {
  // the actual quiz

  constructor() {
    super();
    this.state = {
      question: getQuestion(1),
      answer: getAnswer(1),
      total: getCount(),
      i: 1,
      points: 0
    };
  }

  nextQuestion() {
    this.setState({
      question: getQuestion(this.state.i + 1),
      answer: getAnswer(this.state.i + 1),
      i: this.state.i + 1,
      points: this.state.points + 100
    });
  }

  render() {
    let { points } = this.state;
    return (
      <div>
        <div class="back-button">
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

        <div class="card-panel">
          <div class="row">
            <h5 class="col s10">Today's Review: 5 Words </h5>
            <h5 class="col s2 center-align">Points: {points}</h5>
            <h5 class="col s2 right-align" />
          </div>
        </div>

        <div>
          <center>
            {this.state.total ? (
              <Count i={this.state.i} total={this.state.total} />
            ) : null}
            <Flashcard
              question={this.state.question}
              answer={this.state.answer}
            />
            {this.state.total && this.state.i >= this.state.total ? null : (
              <button
                className="nextButton"
                onClick={this.nextQuestion.bind(this)}
                class="btn"
              >
                Easy
              </button>
            )}
            {this.state.total && this.state.i >= this.state.total ? null : (
              <button
                className="nextButton"
                onClick={this.nextQuestion.bind(this)}
                class="btn"
              >
                Good
              </button>
            )}
            {this.state.total && this.state.i >= this.state.total ? null : (
              <button
                className="nextButton"
                onClick={this.nextQuestion.bind(this)}
                class="btn"
              >
                Okay
              </button>
            )}
            {this.state.total && this.state.i >= this.state.total ? null : (
              <button
                className="nextButton"
                onClick={this.nextQuestion.bind(this)}
                class="btn"
              >
                Hard
              </button>
            )}
          </center>
        </div>
      </div>
    );
  }
}

class Flashcard extends Component {
  constructor() {
    super();
    this.state = {
      reveal: false
    };
  }

  componentWillReceiveProps() {
    this.setState({ reveal: false });
  }

  flip() {
    this.setState({
      reveal: !this.state.reveal
    });
  }

  render() {
    const className =
      "card flip-container" + (this.state.reveal ? " flip" : "");
    return (
      <div>
        <center>
          <div className={className} onClick={this.flip.bind(this)}>
            <div className="flipper">
              <div
                className="front"
                style={{ display: this.state.reveal ? "none" : "" }}
              >
                {this.props.question}
              </div>
              <div
                className="back"
                style={{ display: this.state.reveal ? "" : "none" }}
              >
                {this.props.answer}
              </div>
            </div>
          </div>
          <button
            className="answerButton"
            onClick={this.flip.bind(this)}
            class="btn"
          >
            Flip
          </button>
        </center>
      </div>
    );
  }
}

const Count = ({ i, total }) => (
  <div>
    Question {i} / {total}
  </div>
);

export default Review;

// constructor() {
//   super();
//   this.unsubscribe = null;

//   this.ref = firebase.firestore().collection("flashcards");
//   this.query = this.ref.where('capital', '==', true);

//   this.state = {
//     cards: [],
//     user: null,
//     currentcard: "",
//     english: "",
//     pinyin: "",
//     hanzi: "",
//     deckid: "",
//     title: "",
//     currentCard: {}
//   };
// }

// onCollectionUpdate = querySnapshot => {
//   //cards
//   const cards = [];
//   //const id = this.props.location.state;
//   querySnapshot.forEach(doc => {
//     const { english, pinyin, hanzi, deckid } = doc.data();
//     cards.push({
//       key: doc.id,
//       doc, // DocumentSnapshot
//       english,
//       pinyin,
//       hanzi,
//       deckid
//     });
//   });
//   this.setState({
//     cards
//   });
// };

// componentDidMount() {
//   /*
//     auth.onAuthStateChanged(user => {
//       if (user) {
//         this.setState({ user });
//       }
//     });
//     */
//   const { id } = this.props.location.state;
//   if (id) {
//     this.setState({ deckid: id });
//   }

//   const cards = [];
//   //const id = this.props.location.state;

//   this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
// }

// render() {
//   const { id } = this.props.location.state;

//   return (
//     // Back Button Layer
//     <div>
//       <div class="container">
//         <div class="back-button">
//           <Link
//             to={{
//               pathname: "/deck/" + id,
//               state: { id: id }
//             }}
//           >
//             <button class="btn-floating btn-large waves-effect waves-light blue">
//               <i class="material-icons">arrow_back</i>
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* Flashcard Layer */}
//       <div class="container">
//         <section className="display-deck">
//           <div class="panel-heading">
//             <h3 class="panel-title">Cards</h3>
//           </div>
//           <div class="panel-body">
//             <table class="table table-stripe">
//               <thead>
//                 <tr>
//                   <th>English</th>
//                   <th>Pinyin</th>
//                   <th>Chinese</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {this.state.cards
//                   .filter(card => card.deckid === id)
//                   .map(card => (
//                     <tr key={card.id}>
//                       <td>{card.english}</td>
//                       <td>{card.pinyin}</td>
//                       <td>{card.hanzi}</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
