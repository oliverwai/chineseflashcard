import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider } from "./config/firebase.js";
import Dashboard from "./components/dashboard/Dashboard";
import DeckDetails from "./components/deck/DeckDetails";
import Leaderboard from "./components/gamification/Leaderboard";
import "react-bootstrap/dist/react-bootstrap.min.js";
import NavBar from "./components/navbar/NavBar";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Edit from "./components/Edit";
import Create from "./components/Create";
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
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/edit/:id" component={Edit} />
            <Route path="/create" component={Create} />
            <Route path="/review/:id" component={Review} />
            <Route path="/deck/:id" component={DeckDetails} />
            <Route path="/leaderboard" component={Leaderboard} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
