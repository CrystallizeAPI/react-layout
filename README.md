![alt text](https://raw.githubusercontent.com/snowballdigital/react-layout/HEAD/media/logo.png 'Boxes')

# react-layout

Helpers for setting up main layout with side menues

## Usage

```
import CrystallizeLayout, { toggleLeft, toggleRight } from '@crystallize/react-layout';

<CrystallizeLayout left={LeftComponent} right={RightComponent}>{({ leftShown, rightShown, contentPushed}) => (
    <div>
        <button onClick={toggleLeft}>Toggle left menu</button>
        <button onClick={toggleRight}>Toggle right menu</button>
    </div>
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
