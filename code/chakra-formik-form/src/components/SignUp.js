import React from 'react'
import { 
  Box,
  Input,
  Button,
  Center,
  Link,
  InputLeftElement,
  InputGroup,
  Stack,
  FormHelperText,
} from "@chakra-ui/react"
import { FaUserAlt, FaEnvelopeOpen, FaLock, FaWeixin, FaQq } from 'react-icons/fa'
import  { Formik, Form, Field, ErrorMessage } from 'formik'
import* as Yup from 'yup'
import axios from 'axios'

function SignUp() {
  const initialValues = {username: '', email: '', password: ''};
  const handleSubmit = (values) => {
    axios.post('https://conduit.productionready.io/api/users', {
      "user": values
    }).then(function (response) {
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
  };
  const schema = Yup.object({
    username: Yup.string()
      .min(2, "昵称最小长度为2个字符！")
      .max(15, "昵称最大长度为15个字符！")
      .required("请输入用户昵称！"),
    email: Yup.string()
      .email("邮箱格式不正确！")
      .required("请输入邮箱！"),
    password: Yup.string()
      .required("请设置密码！")
  });
  return (
    <Box>
      <Formik 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        <Form>
          <Stack>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<FaUserAlt fontSize="16" color="#969696"/>} />
              <Field as={Input} _focus="none" pl="2.5rem" borderRadius="sm" bgColor="#b5b5b51a" size="md" fontSize={14} placeholder="你的昵称" name="username" />
            </InputGroup>
            <ErrorMessage name="username">{msg => <FormHelperText fontSize="12px" color="#ea6f5a">{msg}</FormHelperText>}</ErrorMessage>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<FaEnvelopeOpen fontSize="16" color="#969696"/>} />
              <Field as={Input} pl="2.5rem" _focus="none" borderRadius="sm" bgColor="#b5b5b51a" size="md" fontSize={14} placeholder="邮箱" name="email" />
            </InputGroup>
            <ErrorMessage name="email">{msg => <FormHelperText fontSize="12px" color="#ea6f5a">{msg}</FormHelperText>}</ErrorMessage>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<FaLock fontSize="16" color="#969696"/>} />
              <Field as={Input} pl="2.5rem" _focus="none" borderRadius="sm" bgColor="#b5b5b51a" size="md" fontSize={14} placeholder="设置密码" name="password" />
            </InputGroup>
            <ErrorMessage name="password">{msg => <FormHelperText fontSize="12px" color="#ea6f5a">{msg}</FormHelperText>}</ErrorMessage>
          </Stack>
          <Button type="submit" _hover={{bg: "#3db922"}} bg="#42c02e" color="#fff" w="100%" size="sm" fontWeight={500} mt={4} borderRadius="2xl" _focus="none">注册</Button>
        </Form>
      </Formik>
      <Box fontSize="12px" color="#969696" my="10px">
        <Center>点击"注册"及表示您同意并愿意遵守</Center>
        <Center>
          <Link href="#" color="#3194d0" _focus="none">用户协议</Link>
          &nbsp;和&nbsp;
          <Link href="#" color="#3194d0" _focus="none">隐私政策</Link> 。
        </Center>
      </Box>
      <Box position="relative" mt="50px">
        <Center
          _before={{
            content: '""',
            borderTop: "1px solid #b5b5b5",
            display: "block",
            position: "absolute",
            width: "60px",
            top: "10px",
            left: "30px"
          }} 
          _after={{
            content: '""',
            borderTop: "1px solid #b5b5b5",
            display: "block",
            position: "absolute",
            width: "60px",
            top: "10px",
            right: "30px"
          }}
          fontSize="12px" color="#969696" mb="10px">社交账号直接注册</Center>
        <Center>
          <Link href="#" _focus="none" mr="35px">
            <FaWeixin fontSize="32px" color="#00bb29"/> 
          </Link>
          <Link href="#" _focus="none">
            <FaQq fontSize="24px" color="#498ad5"/>
          </Link>
        </Center>
      </Box>
    </Box>
  );
}

export default SignUp;
