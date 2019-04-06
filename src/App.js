import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider } from "./config/firebase.js";
import Dashboard from "./components/dashboard/Dashboard";
import DeckDetails from "./components/deck/DeckDetails";
import NavBar from "./components/navbar/NavBar";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

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
            <Route path="/deck/:id" component={DeckDetails} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
