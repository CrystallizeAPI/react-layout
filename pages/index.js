import React from 'react';

import CrystallizeLayout, { showRight, showLeft } from '../module';

const left = () => <aside>Left menu</aside>;
const right = () => <aside>Right menu</aside>;

export default class Test extends React.Component {
  state = {
    transitionProp: 'left/right'
  };

  showLeft = async () => {
    console.log('Showing left');
    const shown = await showLeft();
    console.log('Shown?', shown);
  };

  onChange = () => {
    this.setState(state => ({
      transitionProp:
        state.transitionProp === 'left/right' ? 'transform' : 'left/right'
    }));
  };

  render() {
    const { transitionProp } = this.state;

    return (
      <CrystallizeLayout
        left={left}
        right={right}
        speed="500"
        transitionProp={transitionProp}
      >
        <div className="bg">
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
            .bg {
              background: center center no-repeat url('/static/bg.jpg');
              background-size: cover;
              color: #fff;
            }

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

            main > div {
              margin-bottom: 15px;
            }

            label {
              display: inline-block;
              padding: 5px 10px;
              margin-left: 10px;
              background: rgba(0, 0, 0, 0.2);
              border-radius: 15px;
            }
          `}</style>
          <main>
            <h1>React layout</h1>
            <div>
              Transition on{' '}
              <label>
                left/right{' '}
                <input
                  type="radio"
                  checked={transitionProp === 'left/right'}
                  onChange={this.onChange}
                />
              </label>
              <label>
                transform
                <input
                  type="radio"
                  checked={transitionProp === 'transform'}
                  onChange={this.onChange}
                />
              </label>
            </div>
            <button onClick={this.showLeft}>Show left</button>
            <button onClick={showRight}>Show right</button>
          </main>
        </div>
      </CrystallizeLayout>
    );
  }
}
