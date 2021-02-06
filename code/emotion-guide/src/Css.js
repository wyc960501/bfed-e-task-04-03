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