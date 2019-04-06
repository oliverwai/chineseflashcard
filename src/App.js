import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider } from "./config/firebase.js";
import Dashboard from "./components/dashboard/Dashboard";
import NavBar from "./components/navbar/NavBar";
import { BrowserRouter, Route, Link } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  render() {
    return (
      <div className="app">
        <NavBar />
        <Dashboard />
      </div>
    );
  }
}
export default App;
