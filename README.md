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



# Formik

## Formik 简介

#### 1、Formik 介绍

- 增强表单处理能力，简化表单处理流程
- 官网 (https://jaredpalmer.com/formik)

#### 2、Formik 下载

```js
npm install formik

```

## Formik 增强表单

####  Formik 基本使用

使用 formik 进行表单数据绑定以及表单提交处理

```js
import { useFormik } from 'formik'

function App() {
  const formik = useFormik({
    initialValues: {username: "zhangshan", password: "123456"},
    onSubmit: (values) => {
      console.log(values)
    }
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <input 
        type="text"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
      />
      <input
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      <input type="submit" />
    </form>
  );
}

export default App
```

#### 表单验证

初始化验证

```js
const formik = useFormik({
  validate: values => {
    const errors = {}
    if (!values.username) errors.username = '请输入用户名'
    return errors
  }
})

return <form>{formik.errors.username ? <div>formik.errors.username</div> : null}</form>
```

表单验证优化

完善错误信息提示时的用户体验

1、开启离开焦点是触发验证

```js
onBlur={formik.handleBlur}
```

2、提示信息时检查表单元素的值是否被改动过

```js
{formik.touched.username && formik.errors.username ? <div>{formik.errors.username}</div> : null}
```

综上实例

```js
import { useFormik } from 'formik'

function App() {
  const formik = useFormik({
    initialValues: {username: "", password: ""},
    validate: values => {
      const errors = {}
      if (!values.username) {
        errors.username = '请输入用户名'
      } else if (values.username.length > 15) {
        errors.username = '用户名的长度不能大于15'
      }

      if (values.password.length < 6 ) {
        errors.password = '用户名密码不能小于6'
      }
      return errors
    },
    onSubmit: (value) => {
      console.log(value)
    }
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <input 
        type="text"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <p>{formik.touched.username && formik.errors.username ? formik.errors.username : null}</p>
      <input
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <p>{formik.touched.password && formik.errors.password ? formik.errors.password : null}</p>
      <input type="submit" />
    </form>
  );
}

export default App;

```

使用 yup 验证

1、下载 yup

```js
npm install yup
```

2、引入 yup

```js
import * as Yup from 'yup'
```

3、定义验证规则

```js
validationSchema: Yup.object({
  username: Yup.string()
    .max(15, "用户名的长度不能大于15")
    .required("请填写用户名"),
  password: Yup.string()
    .max(6, "密码的长度不能小于6")
    .required("请填写密码")
})
```

```js
// 实例

import { useFormik } from 'formik'
import * as Yup from 'yup'

function App() {
  const formik = useFormik({
    initialValues: {username: "", password: ""},
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "用户名的长度不能大于15")
        .required("请填写用户名"),
      password: Yup.string()
        .max(6, "密码的长度不能小于6")
        .required("请填写密码")
    }),
    onSubmit: (value) => {
      console.log(value)
    }
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <input 
        type="text"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <p>{formik.touched.username && formik.errors.username ? formik.errors.username : null}</p>
      <input
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <p>{formik.touched.password && formik.errors.password ? formik.errors.password : null}</p>
      <input type="submit" />
    </form>
  );
}

export default App;
```

#### 减少样板代码

```js
{...formik.getFieldProps('username')}
```

```js
// 实例

import { useFormik } from 'formik'
import * as Yup from 'yup'

function App() {
  const formik = useFormik({
    initialValues: {username: "", password: ""},
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "用户名的长度不能大于15")
        .required("请填写用户名"),
      password: Yup.string()
        .max(6, "密码的长度不能小于6")
        .required("请填写密码")
    }),
    onSubmit: (value) => {
      console.log(value)
    }
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <input 
        type="text"
        name="username"
        { ...formik.getFieldProps('username') }
      />
      <p>{formik.touched.username && formik.errors.username ? formik.errors.username : null}</p>
      <input
        type="password"
        name="password"
        { ...formik.getFieldProps('password') }
      />
      <p>{formik.touched.password && formik.errors.password ? formik.errors.password : null}</p>
      <input type="submit" />
    </form>
  );
}

export default App;
```

#### 使用组件的方式构建表单

```js
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

function App() {
  const initialValues = {username: ''}
  const handleSubmit = (values) => {
    console.log(values)
  }
  const schema = Yup.object({
    username: Yup.string()
      .max(15, "用户名的长度不能大于15")
      .required("请输入用户名")
  })
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      <Form>
        <Field name="username" />
        <ErrorMessage name="username" />
        <input type="submit" />
      </Form>
    </Formik>
  )
}

export default App;
```

#### 构建其他表单项（Field 组件的 as 属性）

默认情况下，Field 组件渲染的是文本框，如果要生成其他表单元素可以使用以下语法

```js
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

function App() {
  const initialValues = {username: '', content: '我是内容', subject: 'Java'}
  const handleSubmit = (values) => {
    console.log(values)
  }
  const schema = Yup.object({
    username: Yup.string()
      .max(15, "用户名的长度不能大于15")
      .required("请输入用户名")
  })
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      <Form>
        <Field name="username" />
        <ErrorMessage name="username" />
        <Field name="content" as="textarea"/>
        <Field name="subject" as="select">
          <option value="大前端">大前端</option>
          <option value="Java">Java</option>
        </Field>
        <input type="submit" />
      </Form>
    </Formik>
  )
}

export default App;
```

#### 使用 useField 构建自定义表单控件

```js
import { Formik, Form, Field, ErrorMessage, useField } from "formik"
import * as Yup from "yup"

function MyInput ({label, ...props}) {
  const [field, meta] = useField(props)
  return <div>
    <lable htmlFor={props.id}>{label}</lable>
    <input {...field} {...props} />
    { meta.touched && meta.error ? <span>{meta.error}</span> : null }
  </div>
}

function App() {
  const initialValues = {username: '', password: ''}
  const handleSubmit = (values) => {
    console.log(values)
  }
  const schema = Yup.object({
    username: Yup.string()
      .max(15, "用户名的长度不能大于15")
      .required("请输入用户名"),
    password: Yup.string()
      .min(6, "密码的长度不能小于6")
      .required("请输入密码")
  })
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      <Form>
        <Field name="username" />
        <ErrorMessage name="username" />
        <MyInput id="myPass" label="密码" name="password" type="password" placeholder="请输入密码"/>
        <input type="submit" />
      </Form>
    </Formik>
  )
}

export default App;
```

#### 构建自定义表单控件 Checkbox

```js
import { Formik, Form, Field, ErrorMessage, useField } from "formik"
import * as Yup from "yup"

function CheckBox ({label, ...props}) {
  const [field, meta, helper] = useField(props)
  const { value } = meta
  const { setValue } = helper
  const handleChange = () => {
    const set = new Set(value)
    if (set.has(props.value)) {
      set.delete(props.value)
    } else {
      set.add(props.value)
    }
    setValue([...set])
  }
  return <div>
    <lable htmlFor="">
      <input checked={value.includes(props.value)} type="checkbox" {...props} onChange={handleChange}/> {label}
    </lable>
  </div>
}

function App() {
  const initialValues = {username: '', hobbies: ["足球","篮球"]}
  const handleSubmit = (values) => {
    console.log(values)
  }
  const schema = Yup.object({
    username: Yup.string()
      .max(15, "用户名的长度不能大于15")
      .required("请输入用户名")
  })
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      <Form>
        <Field name="username" />
        <ErrorMessage name="username" />
        <CheckBox label="足球" value="足球" name="hobbies" />
        <CheckBox label="篮球" value="篮球" name="hobbies" />
        <CheckBox label="橄榄球" value="橄榄球" name="hobbies" />
        <input type="submit" />
      </Form>
    </Formik>
  )
}

export default App;
```



# 受控组件与非受控组件的选用标准

### 非受控组件

表单数据交由 DOM 节点管理，特点是表单数据在需要时进行获取，代码实现相对简单

```js
function App() {
  const userInput = useRef()
  function handleSubmit () {
    const username = userInput.current.value
  }
  return <form onSubmit={handleSubmit}>
    <input type="text" ref={userInput}>
    <input type="submit">
  </form>
}
```

### 受控组件

表单数据交由 state 对象管理， 特点是可以实时得到表单数据，代码相对复杂

```js
class App extends Component {
  state = { username: ''}
  handleChange (event) {
    this.setState({username: event.target.value})
  }
  render() {
    return <form>
      <input type="text" value={this.state.username} onChange={this.handleChange.bind(this)} />
      <span>{this.state.username}</span>
    </form>
  }
}
```

### 选用标准

总结：受控组件和费受控组件都有其特点，应根据需求场景进行选择，在大多数情况下，推荐使用受控组件处理表单数据
如果表单在数据交互方面比较简单，使用非受控表单，否则使用受控表单

| 场景 | 非受控 | 受控 |
| ---  | --- | --- |
| 表单提交时取值 | √ | √ |
| 表单提交时验证 | √ | √ |
| 表单项元素实时验证 | × | √ |
| 根据条件禁用提交按钮 | × | √ |
| 强制输入内容的格式 | × | √ |
| 一个数据的多个输入 | × | √ |




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