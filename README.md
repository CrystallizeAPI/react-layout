![alt text](https://raw.githubusercontent.com/snowballdigital/react-layout/HEAD/media/logo.png 'Boxes')

# react-layout

Helpers for setting up main layout with side menues. React components for building Crystallize powered [React commerce](https://crystallize.com/developers) with SSR using Next.js.

## Install

```
yarn add @crystallize/react-layout
```

## Usage

```
import CrystallizeLayout, { LayoutContext } from '@crystallize/react-layout';

<CrystallizeLayout left={LeftComponent} right={RightComponent}>{({ leftShown, rightShown, contentPushed}) => (
    <LayoutContext.Consumer>
        {({ state, actions }) => (
            <div>
                <div>Left shown? {state.leftShown ? 'yes' : 'no'}</div>
                <div>
                    Right shown? {state.rightShown ? 'yes' : 'no'}
                </div>
                <div>Content pushed: {state.contentPushed}</div>
                <button onClick={actions.toggleLeft}>Toggle left menu</button>
                <button onClick={actions.toggleRight}>Toggle right menu</button>
            </div>
        )}
    </LayoutContext.Consumer>
)}
</CrystallizeLayout>
```

## Exports

- (default) CrystallizeLayout
- showLeft
- hideLeft
- toggleLeft
- showRight
- hideLeft
- toggleRight

## Component props

- left
- right
- leftWidth
- rightWidth
- width (for both left and right)
- transitionProp ('left/right' or 'transform')

## Passed props

All direct children of CrystallizeLayout gets passed the following props

### leftShown (boolean)

Reflects if the left menu is shown

### rightShown (boolean)

Reflects if the right menu is shown

### contentPushed (string)

Reflects the current offset the content has been pushed. Is usually

- 300px (left menu is shown)
- 0px (no menu is shown)
- -300px (right menu is shown)
