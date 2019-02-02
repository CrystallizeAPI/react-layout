import React, { Component } from 'react';
import isCallable from 'is-callable';

import { Outer, Left, Right, Content, ClickOverlay } from './styles';

export const defaultWidth = '300px';
export const defaultTransitionEasing = 'cubic-bezier(0.41, 0.03, 0, 0.96)';

let speed = 250;

// The minimal width in px for the pushed out content
export const minimalWidthForPushedOutContent = 65;

export const LayoutContext = React.createContext();

export default class CrystallizeLayout extends Component {
  state = {
    showLeft: false,
    showRight: false,
    widthOverride: null
  };

  activeWidthOverrides = {
    left: false,
    right: false,
    get any() {
      return this.left || this.right;
    }
  };

  animating = false;

  componentDidMount() {
    speed = parseInt(this.props.speed || 300);

    this.listenForMediaChange();
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize, false);
  }

  componentWillUnmount() {
    this.stopListenForMediaChange();

    window.removeEventListener('resize', this.handleWindowResize);
  }

  startWidthOverride = side => {
    this.activeWidthOverrides[side] = true;
  };

  handleWindowResize = () => {
    clearTimeout(this.widthOverrideSetTimeout);
    this.widthOverrideSetTimeout = setTimeout(() => {
      this.setState({
        widthOverride:
          window.innerWidth - minimalWidthForPushedOutContent + 'px'
      });
    }, 25);

    // Set the current visible viewport to a custom variable
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  stopWidthOverride = side => {
    this.activeWidthOverrides[side] = false;

    if (!this.activeWidthOverrides.any) {
      clearTimeout(this.widthOverrideSetTimeout);
    }
  };

  listenForMediaChange = () => {
    const { width = defaultWidth, leftWidth, rightWidth } = this.props;

    const left = leftWidth || width;
    const right = rightWidth || width;

    this.leftMql = window.matchMedia(
      `(min-width: ${parseInt(left, 10) + minimalWidthForPushedOutContent}px)`
    );
    this.leftMql.addListener(this.handleLeftMediaChange);
    this.handleLeftMediaChange(this.leftMql);

    this.rightMql = window.matchMedia(
      `(min-width: ${parseInt(right, 10) + minimalWidthForPushedOutContent}px)`
    );
    this.rightMql.addListener(this.handleRightMediaChange);
    this.handleRightMediaChange(this.rightMql);
  };

  handleLeftMediaChange = mql => {
    const theScreenIsTooSmallForMenu = !mql.matches;
    if (theScreenIsTooSmallForMenu) {
      this.startWidthOverride('left');
    } else {
      this.stopWidthOverride('left');
    }
  };

  handleRightMediaChange = mql => {
    const theScreenIsTooSmallForMenu = !mql.matches;
    if (theScreenIsTooSmallForMenu) {
      this.startWidthOverride('right');
    } else {
      this.stopWidthOverride('right');
    }
  };

  stopListenForMediaChange = () => {
    this.leftMql.removeListener(this.handleLeftMediaChange);
    this.rightMql.removeListener(this.handleRightMediaChange);
    this.stopWidthOverride('left');
    this.stopWidthOverride('right');
  };

  disableScroll(stop) {
    if (!this.defaultBodyOverflow) {
      const style = getComputedStyle(document.body);
      this.defaultBodyOverflow = style.overflow;
    }
    document.body.style.overflow = stop ? 'hidden' : this.defaultBodyOverflow;
  }

  onToggle = ({ left, right }) => {
    if (this.animating) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.animating = true;

      const showASide = left || right;

      // Blur any active element
      if (document.activeElement) {
        document.activeElement.blur();
      }

      // Ensure we disable scroll before the animation kicks in
      if (showASide) {
        this.disableScroll(true);
      }

      this.setState(
        {
          showLeft: left,
          showRight: right
        },
        () => {
          setTimeout(() => {
            this.animating = false;

            // Enable the scroll after the animation is done
            if (!showASide) {
              this.disableScroll(false);
            }

            resolve();
          }, speed);
        }
      );
    });
  };

  onOverlayClick = e => {
    e.preventDefault();
    this.contextActions.hideBoth();
  };

  contextActions = {
    showLeft: () => this.onToggle({ left: true, right: false }),
    hideLeft: () => this.onToggle({ left: false }),
    toggleLeft: () =>
      this.onToggle({ left: !this.state.leftShown, right: false }),
    showRight: () => this.onToggle({ right: true, left: false }),
    hideRight: () => this.onToggle({ right: false }),
    toggleRight: () =>
      this.onToggle({ right: !this.state.rightShown, left: false }),
    hideBoth: () => this.onToggle({ left: false, right: false })
  };

  render() {
    const {
      left,
      right,
      width = defaultWidth,
      transitionEasing = defaultTransitionEasing,
      leftWidth,
      rightWidth,
      blurContentOnShow,
      transitionProp = 'left',
      children
    } = this.props;
    const { widthOverride } = this.state;

    const leftWidthToUse = this.activeWidthOverrides.left
      ? widthOverride
      : leftWidth || width;
    const rightWidthToUse = this.activeWidthOverrides.right
      ? widthOverride
      : rightWidth || width;

    const { showLeft, showRight } = this.state;

    let contentPushed = '0px';
    if (showLeft) {
      contentPushed = leftWidthToUse;
    } else if (showRight) {
      contentPushed = `-${rightWidthToUse}`;
    }

    const LeftCmp = left || null;
    const RightCmp = right || null;

    // Enable the blur content on show prop setting
    let blurContentOnShowProp = blurContentOnShow;
    if (blurContentOnShow && typeof blurContentOnShow === 'boolean') {
      blurContentOnShowProp = '3px';
    }

    const exposedState = {
      leftShown: showLeft,
      rightShown: showRight,
      contentPushed
    };

    return (
      <LayoutContext.Provider
        value={{
          state: exposedState,
          actions: this.contextActions
        }}
      >
        <Outer
          showLeft={showLeft}
          showRight={showRight}
          leftWidth={leftWidthToUse}
          rightWidth={rightWidthToUse}
          speed={speed}
          transitionProp={transitionProp}
          transitionEasing={transitionEasing}
        >
          {(showLeft || showRight) && (
            <ClickOverlay
              showLeft={showLeft}
              showRight={showRight}
              leftWidth={leftWidthToUse}
              rightWidth={rightWidthToUse}
              onClick={this.onOverlayClick}
              transitionProp={transitionProp}
              transitionEasing={transitionEasing}
            />
          )}
          <Content
            leftShown={showLeft}
            rightShown={showRight}
            blurContentOnShow={blurContentOnShowProp}
            speed={speed}
            transitionProp={transitionProp}
            transitionEasing={transitionEasing}
          >
            {children}
          </Content>
          {LeftCmp && (
            <Left
              width={leftWidthToUse}
              show={showLeft}
              speed={speed}
              transitionProp={transitionProp}
              transitionEasing={transitionEasing}
            >
              <LeftCmp shown={showLeft} />
            </Left>
          )}
          {RightCmp && (
            <Right
              width={rightWidthToUse}
              show={showRight}
              speed={speed}
              transitionProp={transitionProp}
              transitionEasing={transitionEasing}
            >
              <RightCmp shown={showRight} />
            </Right>
          )}
        </Outer>
      </LayoutContext.Provider>
    );
  }
}
