/** 
 *  emotion 中 css 属性优先级
 */

// import React from 'react';
// import { css } from '@emotion/core'
// import Css from './Css'


// const style = css`
//   background: pink
// `

// function App() {
//   return <div>
//     <Css css={style}/>
//   </div>
// }

// export default App;



/** 
 *  创建样式化组件 or 样式化组件默认样式的覆盖方式
 * */

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
    <Container w={1600}>
      <Button bgColor="green">我是按钮</Button>
    </Container>
  )
}

export default App