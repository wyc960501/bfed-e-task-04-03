# CSS-IN-JS

### 1、为什么会有 CSS-IN-JS

CSS-IN-JS 是 WEB 项目中将 CSS 代码捆绑在 JavaScript 代码中的解决方案
这种方案旨在解决 CSS 的局限性，例如缺乏动态功能，作用域和可移植性


### 2、CSS-IN-JS 介绍

CSS-IN-JS 方案的有点：

1. 让 CSS 代码拥有独立的作用域，阻止 CSS 代码泄露到组件外部，防止样式冲突
2. 让组件更具可移植性，实现开箱即用，轻松创建松耦合的应用程序
3. 让组件更具有可重用性，只需要编写一次即可，可以在任何地方运行，不仅可以在同一应用程序中重用组件，而且可以在使用相同框架构建的其他应用程序中重用组件
4. 让样式具有动态功能，可以将复杂的逻辑应用于样式规则，如果要创建需要动态功能的复杂 UI，它是理想的解决方案

CSS-IN-JS 方案的缺点：

1. 为项目增加了额外的复杂性
2. 自动生成的选择器大大降低了代码的可读性


### 3、Emotion 库

#### Emotion 介绍

Emotion 是一个旨在使用 JavaScript 编写 CSS 样式的库

npm install @emotion/core @emotion/styled

#### css 属性支持

JSX Pragma

通知 babel, 不在需要将 JSX 语法转换为 React.createElement 方法，而是需要转换为 jsx 方法

| | Input | Output |
| --- | --- | --- |
| Before | <'img src="avatar.png" /> | React.createElement('img', { src:'avatar.png' }) |
| After | <'img src="avatar.png" /> |jsx('img', { src: 'avatar.png' })

```js
/** @jsx jsx */
import { jsx } from '@emotion/core'
```

Babel Preset

npm run eject
在 package.json 文件中找到 babel 属性，加入如下内容

```js
"presets": [
  "react-app",
  "@emotion/babel-preset-css-prop"
]
```

#### css 方法

String Styles (推荐)

```js
const style = css`
  width: 100px;
  height: 100px;
  background: skyblue;
`

<div css={style}> App works </div>
```

Object Styles

```js
const style = css({
  width: 200,
  height: 200,
  background: "red"
})

<div css={style}> App words </div>
```

#### css 属性优先级

props 对象中的 css 属性优先级高于组件内部的 css 属性
在调用组件时可以覆盖组件默认样式

```js
// Css.js

import React from 'react'
import { css } from '@emotion/core'

const style = css`
  width: 200px;
  height: 200px;
  background: skyblue;
`
function Css (props) {
  return <div css={style} {...props}>Css</div>
}

export default Css


// App.js

import React from 'react';
import { css } from '@emotion/core'
import Css from './Css'

const style = css`
  background: pink
`

function App() {
  return <div>
    <Css css={style}/>
  </div>
}

export default App;
```

#### Styled Components 样式化组件

样式化组件就是用来构建用户界面的，是 emotion 库提供的另一种为元素添加样式的方式

创建样式化组件 or 默认样式化的覆盖方式

```js
import React from 'react'
import styled from '@emotion/styled'

// String Styles
const Button = styled.button`
  width: 200px;
  height: 30px;
  background: ${props => props.bgColor || 'skyblue'};
`

// Object Styles
const Container = styled.div(props => ({
  width: props.w || 1000,
  margin: '0 auto',
  background: 'pink'
}))

function App() {
  return (
    <Container w={2600}>
      <Button bgColor="green">我是按钮</Button>
    </Container>
  )
}

export default App
```