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