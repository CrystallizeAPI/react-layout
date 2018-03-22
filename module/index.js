import React, { Component } from 'react';
import Emitter from 'tiny-emitter';

import { Outer, Left, Right, Content, ClickOverlay } from './styles';

const defaultWidth = '300px';

export const emitter = new Emitter();
const showStatus = {
  left: false,
  right: false
};

export const toggleLeft = (show = !showStatus.left) => {
  showStatus.left = show;
  emitter.emit('toggle', showStatus);
  if (show && document.activeElement) {
    document.activeElement.blur();
  }
};
export const showLeft = () => toggleLeft(true);
export const hideLeft = () => toggleLeft(false);

export const toggleRight = (show = !showStatus.right) => {
  showStatus.right = show;
  emitter.emit('toggle', showStatus);
  if (show && document.activeElement) {
    document.activeElement.blur();
  }
};
export const showRight = () => toggleRight(true);
export const hideRight = () => toggleRight(false);

export default class CrystallizeLayout extends Component {
  state = {
    showLeft: showStatus.left,
    showRight: showStatus.right
  };

  componentDidMount() {
    emitter.on('toggle', this.onToggle);
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
    toggleLeft(false);
    toggleRight(false);
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
      rightWidth
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

    return (
      <Outer
        showLeft={showLeft}
        showRight={showRight}
        leftWidth={leftWidthToUse}
        rightWidth={rightWidthToUse}
      >
        {(showLeft || showRight) && (
          <ClickOverlay
            showLeft={showLeft}
            showRight={showRight}
            onClick={this.onOverlayClick}
          />
        )}
        <Content>
          {this.renderChildren({
            leftShown: showLeft,
            rightShown: showRight,
            contentPushed
          })}
        </Content>
        {LeftCmp && (
          <Left width={leftWidthToUse} show={showLeft}>
            <LeftCmp shown={showLeft} />
          </Left>
        )}
        {RightCmp && (
          <Right width={rightWidthToUse} show={showRight}>
            <RightCmp shown={showRight} />
          </Right>
        )}
      </Outer>
    );
  }
}
