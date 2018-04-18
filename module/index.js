import React, { Component } from 'react';
import Emitter from 'tiny-emitter';

import { Outer, Left, Right, Content, ClickOverlay } from './styles';

const defaultWidth = '300px';

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
        r.reject(`@crystallize/react-layout. Cancelled: ${r.type}`);
        r.handeled = true;
      }
    });
  }

  return new Promise((resolve, reject) => {
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
          resolver.resolve();
        }
        toggleResolvers.splice(toggleResolvers.indexOf(r => r === resolver), 1);
      }, speed),
      resolve,
      reject
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
    showRight: showStatus.right
  };

  componentDidMount() {
    emitter.on('toggle', this.onToggle);
    speed = parseInt(this.props.speed || 300);
  }

  componentWillUnmount() {
    emitter.off('toggle', this.onToggle);
  }

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
    return React.Children.map(this.props.children, child => {
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
      blurContentOnShow
    } = this.props;

    const leftWidthToUse = leftWidth || width;
    const rightWidthToUse = rightWidth || width;

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
      >
        {(showLeft || showRight) && (
          <ClickOverlay
            showLeft={showLeft}
            showRight={showRight}
            onClick={this.onOverlayClick}
            speed={speed}
          />
        )}
        <Content
          leftShown={showLeft}
          rightShown={showRight}
          blurContentOnShow={blurContentOnShowProp}
          speed={speed}
        >
          {this.renderChildren({
            leftShown: showLeft,
            rightShown: showRight,
            contentPushed
          })}
        </Content>
        {LeftCmp && (
          <Left width={leftWidthToUse} show={showLeft} speed={speed}>
            <LeftCmp shown={showLeft} />
          </Left>
        )}
        {RightCmp && (
          <Right width={rightWidthToUse} show={showRight} speed={speed}>
            <RightCmp shown={showRight} />
          </Right>
        )}
      </Outer>
    );
  }
}
