# React Hooks

## 1、React Hooks 介绍

#### React Hooks 是用来做什么的

- 对函数组件进行增强，让函数组件可以存储状态，可以拥有处理副作用的能力
- 让开发者在不使用类组件的情况下，实现相同的功能

#### 类组件的不足（Hooks 要解决的问题）

- 缺少逻辑复用机制

  - 为了复用逻辑增加无实际渲染效果的组件，增加了组件层级，显示十分臃肿
  - 增加了调试的难度以及运行效率的降低

- 类组件经常会变得很难以维护

  - 将一组相干的业务逻辑拆分到了多个生命周期函数中
  - 在一个函数生命周期内存在多个不相干的业务逻辑

- 类成员方法不能保证this指向的正确性

## 2、React Hooks 使用

Hooks 意味钩子, React Hooks 就是一堆钩子函数,React 通过这些钩子函数对函数组件经行增强,不同的钩子函数提供了不同的功能

- useState()
- useEffects()
- useReducer()
- useRef()
- useCallback()
- useContext()
- useMemo()

#### useState()

用于为函数组件引入状态

```js
import { useState } from 'react';

function App() {
  const [ count, setCount ] = useState(0)
  return (
    <div className="App">
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+ 1</button>
    </div>
  );
}

export default App;
```

- 接收唯一的参数即状态初始值,初始值可以是任意数据类型
- 返回值为数组,数组中存储状态值和更改状态值的方法,方法名称约定以 set 开头,后面加上状态名称
- 方法可以被多次调用,用以保存不同状态值
- 参数可以是一个函数,函数返回什么,初始状态就是什么,函数只会被调用一次,用在初始值是动态值的情况

设置状态方法的使用细节

- 设置状态方法的参数可以是一个值也可以是一个函数
- 设置状态方法的方法本身是异步的

实现原理

```js
import ReactDOM from 'react-dom'

let state = []
let setters = []
let stateIndex = 0

function createSetter (stateIndex) {
  return function (newState) {
    state[stateIndex] = newState
    render()
  }
}

function useState (initialState) {
  state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState
  setters.push(createSetter(stateIndex))
  let value = state[stateIndex]
  let setter = setters[stateIndex]
  stateIndex++
  return [value, setter]
}

function render () {
  stateIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <span>{name}</span>
    <button onClick={() => setName('李四')}>更改名字</button>
  </div>
}

export default App;
```

#### useReducer()

useReducer 是另一种让函数组件保存状态的方式

```js
import { useReducer } from 'react';

function App() {
  function reducer (state, action) {
    switch (action.type) {
      case 'increment':
        return state + 1;
      case 'decrement':
        return state - 1;
      default:
        return state;
    }
  }
  const [count, dispatch] = useReducer(reducer, 0)
  return <div>
    <button onClick={() => dispatch({type: 'decrement'})}>-1</button>
    <span>{count}</span>
    <button onClick={() => dispatch({type:'increment'})}>+1</button>
  </div>
}

export default App;
```

useReducer 实现原理

```js
import { useState } from 'react'

function useReducer (reducer, initialState) {
  const [state, setState] = useState(initialState)
  function dispatch (action) {
    const newState = reducer(state, action)
    setState(newState)
  }
  return [state, dispatch]
}

function App() {
  function reducer (state, action) {
    switch (action.type) {
      case 'increment':
        return state + 1
      case 'decrement':
        return state - 1
      default:
        return state
    }
  }
  const [count, dispatch] = useReducer(reducer, 0)
  return <div>
    <span>{count}</span>
    <button onClick={() => dispatch({type: 'decrement'})}>-1</button>
    <button onClick={() => dispatch({type: 'increment'})}>+1</button>
  </div>
}

export default App
```

#### useContext()

在跨组件层级获取数据时简化获取数据的代码

```js
import { createContext, useContext } from 'react';

const countContext = createContext();

function App() {
  return <countContext.Provider value={100}>
    <Foo />
  </countContext.Provider>
}

function Foo() {
  const value = useContext(countContext)
  return <div>我是Foo组件{value}</div>
}

export default App
```

#### useEffect()

1、useEffect 执行时机

可以把 useEffect 看做 componentDidMount, componentDidUpdate 和 componentWillUnmount 这三个函数的组合

useEffect(() => {}) ------------>  componentDidMount, componentDidUpdate
useEffect(() => {}, []) ----------> componentDidMount
useEffect(() => () => {}) ------------> componentWillUnMount

2、useEffect使用方法

- 为 window 对象添加滚动事件
- 设置定时器让 count 数值每隔一秒增加1

```js
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

function App() {
  function onScroll () {
    console.log('页面发生滚动了')
  }
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [])

  const [count, setCount] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(count => {
        document.title = count + 1;
        return count + 1
      })
    }, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])
  return <div>
    <span>{count}</span>
    <button onClick={() => ReactDOM.unmountComponentAtNode(document.getElementById('root'))}>卸载组件</button>
  </div>
}

export default App;
```

3、useEffect 解决的问题

- 按照用途将代码进行分类（将一组相干的业务逻辑归置到了同一个副作用函数中）
- 简化重复代码，使组件内部代码更加清晰

4、useEffect 第二个参数作用

指定数据发生变化时触发effect

```js
import { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0)
  const [person, setPerson] = useState({name: '张三'})
  useEffect(() => {
    console.log('111')
    document.title = count
  }, [count])
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <button onClick={() => setPerson({name: '李四'})}>setPerson</button>
  </div>
}

export default App;
```

5、useEffect 结合异步函数

useEffect 中的参数函数不能是异步函数，因为 useEffect 函数要返回清理资源的函数，如果是异步函数就变成了返回Promise

```js
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    (async () => {
      let response = await getData()
      console.log(response)
    })()
  }, [])
  return <div>App React</div>
}

function getData () {
  return new Promise(resolve => {
    resolve({msg: 'Hello'})
  })
}

export default App;
```

6、useEffect 实现原理

```js
import ReactDOM from 'react-dom'

let state = []
let setters = []
let stateIndex = 0

function createSetter (stateIndex) {
  return function (newState) {
    state[stateIndex] = newState
    render()
  }
}

function useState (initialState) {
  state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState
  setters.push(createSetter(stateIndex))
  let value = state[stateIndex]
  let setter = setters[stateIndex]
  stateIndex++
  return [value, setter]
}

function render () {
  stateIndex = 0
  effectIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}

// 上一次的依赖值
let prevDepsAry = []
let effectIndex = 0

function useEffect (callback, depsAry) {
  // 判断 callback 是不是函数
  if (Object.prototype.toString.call(callback) !== '[object Function]') throw new Error('useEffect函数的第一个参数必须是函数')
  // 判断 depsAry 有没有被传递
  if (typeof depsAry === 'undefined') {
    // 没有传递
    callback()
  } else {
    // 判断 depsAry 是不是数组
    if (Object.prototype.toString.call(depsAry) !== '[object Array]') throw new Error('useEffect函数的第二个参数必须是数组')
    // 获取上一次的依赖值
    let prevDeps = prevDepsAry[effectIndex]
    // 将当前的依赖值与上一次的依赖值做对比， 如果有变化调用 callback
    let hasChange = prevDeps ? depsAry.every((dep, index) => dep === prevDeps[index]) === false : true
    // 判断值是否有变化
    if (hasChange) {
      callback()
    }
    // 同步值依赖
    prevDepsAry[effectIndex] = depsAry
    effectIndex++
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')
  useEffect(() => {
    console.log('Hello')
  }, [count])
  useEffect(() => {
    console.log('world')
  }, [name])
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <span>{name}</span>
    <button onClick={() => setName('李四')}>更改名字</button>
  </div>
}

export default App;
```

#### useMemo()

- useMemo 的行为类似Vue中的计算属性，可以检测某个值的变化，根据变化值计算新值

- useMemo 会缓存计算结果，如果监测值没有发生变化，即使组件重新渲染，也不会重新计算，此行为可以有助于避免在每个渲染上进行昂贵的计算

```js
import { useState, useMemo } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [bool, setBool] = useState(true)
  const result = useMemo(() => {
    return count * 2
  }, [count])
  return <div>
    <span>{count} - {result}</span>
    <span>{bool ? '真' : '假'}</span>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <button onClick={() => setBool(!bool)}>setBool</button>
  </div>
}

export default App;
```

#### memo 方法

性能优化，如果本组件中的数据没有放生变化，阻止组件更新，类似类组件中的 PureComponent 和 shouldComponentUpdate

```js
import {useState, memo} from 'react';

function App() {
  const [count, setCount] = useState(0)
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <Foo/>
  </div>
}

const Foo = memo(() => {
  console.log('Foo组件被重新渲染了')
  return <div>我是Foo组件</div>
})

export default App
```

#### useCallback()

性能优化，缓存函数，使组件重新渲染时得到相同的函数实例

```js
import {useState, memo, useCallback } from 'react';

function App() {
  const [count, setCount] = useState(0)
  const resetCount = useCallback(() => setCount(0), [setCount])
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <Foo resetCount={resetCount}/>
  </div>
}

const Foo = memo((props) => {
  console.log('Foo组件被重新渲染了')
  return <div>
    <span>我是Foo组件</span>
    <button onClick={props.resetCount}>resetCount</button>
  </div>
})

export default App
```

#### useRef()

获取DOM元素对象

```js
import { useRef } from 'react';

function App() {
  const box = useRef()
  return <div ref={box} onClick={() => console.log(box)}>box</div>
}

export default App;
```

保存数据（跨组件周期）

即使组件重新渲染，保存的数据仍然还在，保存的数据被更改不会触发组件重新渲染

```js
import { useState, useEffect, useRef } from 'react';

function App() {
  const [count, setCount] = useState(0)
  let timerId = useRef()
  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
  }, [])
  const stopCount = () => {
    clearInterval(timerId.current)
  }
  return <div>
    <span>{count}</span>
    <button onClick={stopCount}>清除定时器</button>
  </div>
}

export default App;
```

## 3、自定义 Hook

- 自定义 Hook 是标准的封装和共享逻辑的方式
- 自定义 Hook 是一个函数，其名称以 use 开头
- 自定义 Hook 其实就是逻辑和内置 Hook 的组合

目的就是为了实现组件之间的逻辑共享

```js
// 实例 1

import { useState, useEffect } from 'react'
import axios from 'axios'

function useGetPost () {
  const [post,  setPost] = useState({})
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => setPost(response.data))
  }, [])
  return [post, setPost]
}

function App() {
  const [post, setPost] = useGetPost()
  return <div>
    <div>{post.title}</div>
    <div>{post.body}</div>
  </div>
}

export default App
```

```js
// 实例 2 实现表单项 value 和 onChange 事件 逻辑共享

import { useState } from 'react'

function useUpdateInput (initialValue) {
  const [value, setValue] = useState(initialValue)
  return {
    value,
    onChange: event => setValue(event.target.value)
  }
}

function App() {
  const usernameInput = useUpdateInput('')
  const passwordInput = useUpdateInput('')
  const submitForm = event => {
    event.preventDefault()
    console.log(usernameInput.value)
    console.log(passwordInput.value)
  }
  return <form onSubmit={submitForm}>
    <input type="text" name="username" {...usernameInput}/>
    <input type="password" name="password" {...passwordInput}/>
    <input type="submit" />
  </form>
}

export default App;
```

## 4、React 路由 Hooks

react-router-dom 路由提供的钩子函数

- useHistory()
- useLocation()
- useRouteMatch()
- useParams()