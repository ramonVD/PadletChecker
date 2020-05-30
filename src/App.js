import React from 'react';
//import logo from './logo.svg';
import PostChecker from "./components/PostChecker";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/collapse.js';

export default class App extends React.PureComponent {
  render() {
    return(
      <div className="baseContainer">
          <PostChecker />
      </div>);
  }
}

