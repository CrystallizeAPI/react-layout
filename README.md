![alt text](https://raw.githubusercontent.com/snowballdigital/react-layout/HEAD/media/logo.png 'Boxes')

# react-layout

Helpers for setting up main layout with side menus. React components for building Crystallize (GraphQL based [PIM](https://crystallize.com/product/product-information-management)) powered [React commerce](https://crystallize.com/developers) with SSR using Next.js. 

## Install

```
yarn add @crystallize/react-layout
```

## Usage

```
import CrystallizeLayout, { LayoutContext } from '@crystallize/react-layout';

<CrystallizeLayout left={LeftComponent} right={RightComponent}>
    <main>
        <LayoutContext.Consumer>
            {({ state, actions }) => (
                <div>
                    <div>Left shown? {state.leftShown ? 'yes' : 'no'}</div>
                    <div>
                        Right shown? {state.rightShown ? 'yes' : 'no'}
                    </div>
                    <div>Content pushed: {state.contentPushed}</div>
                    <button onClick={actions.showLeft}>Show left menu</button>
                    <button onClick={actions.showRight}>Show right menu</button>
                </div>
            )}
        </LayoutContext.Consumer>
    </main>
</CrystallizeLayout>
```

## Exports

- (default) CrystallizeLayout
- LayoutContext
  - actions
    - showLeft
    - showRight
    - hideLeft
    - hideRight
    - hideBoth
    - toggleLeft
    - toggleRight
  - state
    - leftShown
    - rightShown
    - contentPushed

## Component props

- left
- right
- leftWidth
- rightWidth
- width (for both left and right)
- transitionProp ('left/right' or 'transform')

### contentPushed (string)

Reflects the current offset the content has been pushed. Is by default

- 300px (left menu is shown)
- 0px (no menu is shown)
- -300px (right menu is shown)
