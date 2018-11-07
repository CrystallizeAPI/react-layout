import styled from 'styled-components';

const transitionEasing = 'cubic-bezier(0.41, 0.03, 0, 0.96)';

function getOuterLeft(props) {
  if (props.showLeft) {
    return props.leftWidth;
  }
  if (props.showRight) {
    return `-${props.rightWidth}`;
  }
  return '0';
}

function setOuterMoveProperties(props) {
  if (props.transitionProp === 'transform') {
    return `
      transition: transform ${props.speed}ms ${transitionEasing};
      will-change: transform;
      transform: translate3d(${getOuterLeft(props)}, 0, 0);
    `;
  }

  return `
    transition: left ${props.speed}ms ${transitionEasing};
    will-change: left;
    left: ${getOuterLeft(props)};
  `;
}

function setMoveProperties(side) {
  return props => {
    const width = parseInt(props.width, 10);
    let value = 0;

    if (props.transitionProp === 'transform') {
      return `
      ${side}: -${width}px;
      `;

      if (props.show) {
        value = width;
      }
      if (side === 'right') {
        value *= -1;
      }
      return `
        ${side}: -${width}px;
        transform: translate3d(${value}px, 0, 0);
        transition: transform ${props.speed}ms ${transitionEasing};
        will-change: transform;
      `;
    }

    if (!props.show) {
      value = width;
    }

    return `
      ${side}: -${value}px;
      transition: ${side} ${props.speed}ms ${transitionEasing};
      will-change: ${side};
    `;
  };
}

function getContentOverflowX(props) {
  if (props.showLeft || props.showRight) {
    return 'hidden';
  }
  return 'visible';
}

export const Outer = styled.div.attrs({
  className: 'crystallize-layout'
})`
  position: relative;
  ${setOuterMoveProperties};
`;

export const Content = styled.div.attrs({
  className: 'crystallize-layout__content'
})`
  position: relative;
  z-index: 2;
  overflow-x: ${getContentOverflowX};
  background: ${p => p.background};
  ${p =>
    p.blurContentOnShow &&
    `
    transition: filter ${p => p.speed}ms ${transitionEasing};
  `};
  ${p =>
    p.blurContentOnShow &&
    (p.leftShown || p.rightShown) &&
    `
    filter: blur(${p.blurContentOnShow});
  `};
`;

export const Left = styled.div.attrs({
  className: 'crystallize-layout__menu crystallize-layout__menu--left'
})`
  position: fixed;
  top: 0;
  z-index: 1;
  height: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  width: ${p => p.width || '300px'};
  ${setMoveProperties('left')};
`;

export const Right = styled.div.attrs({
  className: 'crystallize-layout__menu crystallize-layout__menu--right'
})`
  position: fixed;
  top: 0;
  z-index: 1;
  height: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  transition: right ${p => p.speed}ms ${transitionEasing};
  width: ${p => p.width || '300px'};
  ${setMoveProperties('right')};
`;

export const ClickOverlay = styled.div.attrs({
  className: 'crystallize-layout__click-overlay'
})`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 3;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  ${function getTransitionProps(props) {
    if (props.transitionProp === 'transform') {
      return 'left: 0;';
    }

    return `
      left: ${getOuterLeft(props)}
    `;
  }};
`;
