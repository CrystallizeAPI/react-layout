import styled from 'styled-components';

function getWidth(props) {
  return props.width || '300px';
}

function getContentLeft(props) {
  if (props.showLeft) {
    return props.leftWidth;
  }
  if (props.showRight) {
    return `-${props.rightWidth}`;
  }
  return '0';
}

export const Outer = styled.div.attrs({
  className: 'crystallize-layout'
})`
  transition: left 0.3s cubic-bezier(0.41, 0.03, 0, 0.96);
  position: relative;
  left: ${getContentLeft};
  will-change: left;
`;

export const Content = styled.div`
  position: relative;
  z-index: 2;
  background: ${p => p.background};
`;

export const Left = styled.div`
  position: fixed;
  top: 0;
  left: -${getWidth};
  z-index: 1;
  height: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  width: ${getWidth};
`;

export const Right = Left.extend`
  left: auto;
  right: -${getWidth};
`;

export const ClickOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: red;
  z-index: 3;
  opacity: 0.3;
`;
