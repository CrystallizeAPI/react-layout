import React from 'react';
import Head from 'next/head';

import CrystallizeLayout, { LayoutContext } from '../module';

const left = () => (
  <aside>
    <div>Left menu</div>
    <LayoutContext.Consumer>
      {({ actions }) => <button onClick={actions.hideLeft}>hide</button>}
    </LayoutContext.Consumer>
  </aside>
);
const right = () => (
  <aside>
    <div>Right menu</div>
    <LayoutContext.Consumer>
      {({ actions }) => <button onClick={actions.hideRight}>hide</button>}
    </LayoutContext.Consumer>
  </aside>
);

export default class Test extends React.Component {
  state = {
    transitionProp: 'left/right'
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
              <LayoutContext.Consumer>
                {({ state, actions }) => (
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
                      <button onClick={actions.showLeft}>Show left</button>
                      <button onClick={actions.showRight}>Show right</button>
                    </div>
                    <br />
                    <hr />

                    <div>
                      <div>
                        <div>Left shown? {state.leftShown ? 'yes' : 'no'}</div>
                        <div>
                          Right shown? {state.rightShown ? 'yes' : 'no'}
                        </div>
                        <div>Content pushed: {state.contentPushed}</div>
                      </div>
                    </div>
                  </div>
                )}
              </LayoutContext.Consumer>
            </main>
          </div>
        </CrystallizeLayout>
      </div>
    );
  }
}
