import React from 'react';

import CrystallizeLayout, { showRight, showLeft } from '../module';

const left = () => <aside>Left menu</aside>;
const right = () => <aside>Right menu</aside>;

class Test extends React.Component {
  render() {
    return (
      <div>
        <style jsx global>{`
          body {
            margin: 0;
          }

          .crystallize-layout__menu {
            background: #f0f0f0;
          }

          aside {
            padding: 20px;
          }
        `}</style>
        <style jsx>{`
          main {
            text-align: center;
            min-height: 150vh;
            padding-top: 45vh;
          }

          h1 {
            margin: 0 0 15px;
            padding-top: 10px;
          }

          button {
            margin: 0 10px;
          }
        `}</style>
        <main>
          <h1>React layout</h1>
          <button onClick={showLeft}>Show left</button>
          <button onClick={showRight}>Show right</button>
        </main>
      </div>
    );
  }
}

export default () => (
  <CrystallizeLayout left={left} right={right} blurContentOnShow>
    <Test />
  </CrystallizeLayout>
);
