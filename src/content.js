import React from 'react';

import logo from './logo.svg';
import { toggleLeft, toggleRight } from './module';

export default class Content extends React.Component {
  render() {
    const { leftShown, rightShown, contentPushed } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button onClick={() => toggleLeft()}>
            Show left menu (is shown? {leftShown.toString()})
          </button>
          <button onClick={() => toggleRight()}>
            Show right menu (is shown? {rightShown.toString()})
          </button>
        </p>
        <div>Content is pushed {contentPushed}</div>
      </div>
    );
  }
}
