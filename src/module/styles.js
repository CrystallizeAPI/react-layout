import styled from 'styled-components';

function getPosition(props) {
  if (props.show) {
    return '0px';
  }
  return `-${props.width || '300px'}`;
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
  transition: left 0.3s cubic-bezier(0.41, 0.03, 0, 0.96),
    right 0.3s cubic-bezier(0.41, 0.03, 0, 0.96);
  position: relative;
  left: ${getOuterLeft};
  will-change: left, right;
`;

export const Content = styled.div.attrs({
  className: 'crystallize-layout__content'
})`
  position: relative;
  z-index: 2;
  overflow-x: ${getContentOverflowX};
  background: ${p => p.background};
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
  transition: left 0.3s cubic-bezier(0.41, 0.03, 0, 0.96);
  width: ${p => p.width || '300px'};
  will-change: left;
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
  transition: right 0.3s cubic-bezier(0.41, 0.03, 0, 0.96);
  width: ${p => p.width || '300px'};
  will-change: right;
`;

export const ClickOverlay = styled.div.attrs({
  className: 'crystallize-layout__click-overlay'
})`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 3;
`;
