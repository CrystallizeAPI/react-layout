import React, { Component } from 'react';
import Emitter from 'tiny-emitter';
import isCallable from 'is-callable';

import { Outer, Left, Right, Content, ClickOverlay } from './styles';

const defaultWidth = '300px';

// The minimal width in px for the pushed out content
const minimalWidthForPushedOutContent = 65;

export const emitter = new Emitter();
const showStatus = {
  left: false,
  right: false
};
let speed = 300;
const toggleResolvers = [];

function toggleSide(side, show) {
  if (toggleResolvers.length > 0) {
    toggleResolvers.forEach(r => {
      if (!r.handeled) {
        r.resolve(false);
        r.handeled = true;
      }
    });
  }

  return new Promise(resolve => {
    if (side === 'both') {
      showStatus.left = false;
      showStatus.right = false;
    } else {
      showStatus[side] = show;
    }

    emitter.emit('toggle', showStatus);

    if (show && document.activeElement) {
      document.activeElement.blur();
    }

    const resolver = {
      type: `${show ? 'Show' : 'Hide'} ${side} side(s)`,
      timeout: setTimeout(() => {
        if (!resolver.handeled) {
          resolver.resolve(true);
        }
        toggleResolvers.splice(toggleResolvers.indexOf(r => r === resolver), 1);
      }, speed),
      resolve
    };

    toggleResolvers.push(resolver);
  });
}

export const toggleLeft = (show = !showStatus.left) => toggleSide('left', show);
export const showLeft = () => toggleLeft(true);
export const hideLeft = () => toggleLeft(false);
export const toggleRight = (show = !showStatus.right) =>
  toggleSide('right', show);
export const showRight = () => toggleRight(true);
export const hideRight = () => toggleRight(false);

export default class CrystallizeLayout extends Component {
  state = {
    showLeft: showStatus.left,
    showRight: showStatus.right,
    widthOverride: null
  };

  activeWidthOverrides = {
    left: false,
    right: false,
    get any() {
      return this.left || this.right;
    }
  };

  componentDidMount() {
    emitter.on('toggle', this.onToggle);
    speed = parseInt(this.props.speed || 300);
    this.listenForMediaChange();
  }

  componentWillUnmount() {
    emitter.off('toggle', this.onToggle);
    this.stopListenForMediaChange();
  }

  startWidthOverride = side => {
    if (!this.activeWidthOverrides.any) {
      this.handleWindowResize();
      window.addEventListener('resize', this.handleWindowResize, false);
    }

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
  };

  stopWidthOverride = side => {
    this.activeWidthOverrides[side] = false;

    if (!this.activeWidthOverrides.any) {
      window.removeEventListener('resize', this.handleWindowResize);
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
      this.defaultBodyOverflow = style.overflowY;
    }
    document.body.style.overflowY = stop ? 'hidden' : this.defaultBodyOverflow;
  }

  onToggle = ({ left, right }) => {
    this.setState({
      showLeft: left,
      showRight: right
    });

    if (left || right) {
      this.disableScroll(true);
    } else {
      this.disableScroll(false);
    }
  };

  onOverlayClick = e => {
    e.preventDefault();
    toggleSide('both');
  };

  renderChildren = additionalProps => {
    const { children } = this.props;

    // Render function
    if (isCallable(children)) {
      return children(additionalProps);
    }

    return React.Children.map(children, child => {
      return React.cloneElement(child, additionalProps);
    });
  };

  render() {
    const {
      left,
      right,
      width = defaultWidth,
      leftWidth,
      rightWidth,
      blurContentOnShow,
      transitionProp = 'left'
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

    return (
      <Outer
        showLeft={showLeft}
        showRight={showRight}
        leftWidth={leftWidthToUse}
        rightWidth={rightWidthToUse}
        speed={speed}
        transitionProp={transitionProp}
      >
        {(showLeft || showRight) && (
          <ClickOverlay
            showLeft={showLeft}
            showRight={showRight}
            leftWidth={leftWidthToUse}
            rightWidth={rightWidthToUse}
            onClick={this.onOverlayClick}
            transitionProp={transitionProp}
          />
        )}
        <Content
          leftShown={showLeft}
          rightShown={showRight}
          blurContentOnShow={blurContentOnShowProp}
          speed={speed}
          transitionProp={transitionProp}
        >
          {this.renderChildren({
            leftShown: showLeft,
            rightShown: showRight,
            contentPushed
          })}
        </Content>
        {LeftCmp && (
          <Left
            width={leftWidthToUse}
            show={showLeft}
            speed={speed}
            transitionProp={transitionProp}
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
          >
            <RightCmp shown={showRight} />
          </Right>
        )}
      </Outer>
    );
  }
}
