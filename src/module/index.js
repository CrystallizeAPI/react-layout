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
};

export const toggleRight = (show = !showStatus.right) => {
  showStatus.right = show;
  emitter.emit('toggle', showStatus);
};

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

  onToggle = ({ left, right }) => {
    this.setState({
      showLeft: left,
      showRight: right
    });
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
      leftWidth = defaultWidth,
      rightWidth = defaultWidth
    } = this.props;

    const { showLeft, showRight } = this.state;

    let contentPushed = '0px';
    if (showLeft) {
      contentPushed = leftWidth;
    } else if (showRight) {
      contentPushed = `-${rightWidth}`;
    }

    const LeftCmp = left || null;
    const RightCmp = right || null;

    return (
      <Outer
        showLeft={showLeft}
        showRight={showRight}
        leftWidth={leftWidth}
        rightWidth={rightWidth}
      >
        {(showLeft || showRight) && (
          <ClickOverlay onClick={this.onOverlayClick} />
        )}
        <Content>
          {this.renderChildren({
            leftShown: showLeft,
            rightShown: showRight,
            contentPushed
          })}
        </Content>
        {LeftCmp && (
          <Left width={leftWidth || width} show={showLeft}>
            <LeftCmp shown={showLeft} />
          </Left>
        )}
        {RightCmp && (
          <Right width={rightWidth || width} show={showRight}>
            <RightCmp shown={showRight} />
          </Right>
        )}
      </Outer>
    );
  }
}
