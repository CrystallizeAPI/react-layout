import React, { Component } from 'react';
import Emitter from 'tiny-emitter';

import { Outer, Left, Content, ClickOverlay } from './styles';

const defaultWidth = '300px';

export const emitter = new Emitter();
const showStatus = {
  left: false,
  right: false
};

export const toggleLeft = (show = !showStatus.left) => {
  showStatus.left = show;
  emitter.emit('toggle', { ...showStatus, showLeft: show });
};

export const toggleRight = (show = !showStatus.right) => {
  showStatus.right = show;
  emitter.emit('toggle', { ...showStatus, showRight: show });
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

  onToggle = ({ showLeft, showRight }) => {
    this.setState({
      showLeft,
      showRight
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
      rightWidth = defaultWidth,
      background = '#fff',
      ...rest
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
          {this.renderChildren({ showLeft, showRight, contentPushed })}
        </Content>
        {LeftCmp && (
          <Left width={leftWidth || width}>
            <LeftCmp />
          </Left>
        )}
        {RightCmp && (
          <Right width={rightWidth || width}>
            <RightCmp />
          </Right>
        )}
      </Outer>
    );
  }
}
