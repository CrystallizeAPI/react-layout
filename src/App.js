import React, { Component } from 'react';

import CrystallizeLayout from './module';

import Left from './menu-left';
import Right from './menu-right';
import Content from './content';

import './App.css';

export default class App extends Component {
  render() {
    return (
      <CrystallizeLayout left={Left} right={Right}>
        <Content />
      </CrystallizeLayout>
    );
  }
}
