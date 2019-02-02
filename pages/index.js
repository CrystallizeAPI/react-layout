import React from 'react';
import Head from 'next/head';

import CrystallizeLayout, {
  showRight,
  showLeft,
  hideLeft,
  hideRight,
  LayoutContext
} from '../module';

const left = () => (
  <aside>
    <div>Left menu</div>
    <button onClick={hideLeft}>hide</button>
  </aside>
);
const right = () => (
  <aside>
    <div>Right menu</div>
    <button onClick={hideRight}>hide</button>
  </aside>
);

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
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
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
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
              }
            `}</style>
            <style jsx>{`
              .bg {
                /*background: center center no-repeat url('/static/bg.jpg');*/
                background-size: cover;
                color: #444;
              }

              main {
                text-align: center;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
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
              <div>
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
                <br />
                <div>
                  <button onClick={this.showLeft}>Show left</button>
                  <button onClick={showRight}>Show right</button>
                </div>
                <br />
                <hr />
                <div>
                  <LayoutContext.Consumer>
                    {({ state, actions }) => (
                      <div>
                        <div>Left shown? {state.leftShown ? 'yes' : 'no'}</div>
                        <div>
                          Right shown? {state.rightShown ? 'yes' : 'no'}
                        </div>
                        <div>Content pushed: {state.contentPushed}</div>
                      </div>
                    )}
                  </LayoutContext.Consumer>
                </div>
              </div>
            </main>
          </div>
        </CrystallizeLayout>
      </div>
    );
  }
}
