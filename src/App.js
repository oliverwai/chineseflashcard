import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider } from "./config/firebase.js";
import Dashboard from "./components/dashboard/Dashboard";
import DeckDetails from "./components/deck/DeckDetails";
import Leaderboard from "./components/gamification/Leaderboard";
import Achievements from "./components/gamification/Achievements";
import "react-bootstrap/dist/react-bootstrap.min.js";
import NavBar from "./components/navbar/NavBar";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Review from "./components/Review";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <NavBar />
          <tr class="clear_row">
            <td colspan="3" />
          </tr>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/review/:id" component={Review} />
            <Route path="/deck/:id" component={DeckDetails} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/achievements" component={Achievements} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
