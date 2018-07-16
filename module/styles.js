import styled from 'styled-components';

const transitionEasing = 'cubic-bezier(0.41, 0.03, 0, 0.96)';

function getPosition(props) {
  if (props.show) {
    return '0px';
  }
  return `-${props.width}`;
}

function getOuterLeft(props) {
  if (props.showLeft) {
    return props.leftWidth;
  }
  if (props.showRight) {
    return `-${props.rightWidth}`;
  }
  return '0';
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
  transition: left ${p => p.speed}ms ${transitionEasing};
  will-change: left;
  position: relative;
  left: ${getOuterLeft};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
  `} ${p =>
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
  left: ${getPosition};
  z-index: 1;
  height: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  transition: left ${p => p.speed}ms ${transitionEasing};
  will-change: left;
  width: ${p => p.width || '300px'};
`;

export const Right = styled.div.attrs({
  className: 'crystallize-layout__menu crystallize-layout__menu--right'
})`
  position: fixed;
  top: 0;
  right: ${getPosition};
  z-index: 1;
  height: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  transition: right ${p => p.speed}ms ${transitionEasing};
  width: ${p => p.width || '300px'};
  will-change: right;
`;

export const ClickOverlay = styled.div.attrs({
  className: 'crystallize-layout__click-overlay'
})`
  position: fixed;
  top: 0;
  left: ${getOuterLeft};
  height: 100vh;
  width: 100vw;
  z-index: 3;
  transition: left ${p => p.speed}ms ${transitionEasing};
  will-change: left;
`;
