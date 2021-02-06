import { 
  Box,
  Input,
  Button,
  Center,
  Link,
  InputLeftElement,
  InputGroup,
  Flex,
  Checkbox,
  Spacer,
  Stack,
  FormHelperText 
} from "@chakra-ui/react"
import { FaLock, FaWeixin, FaEnvelopeOpen, FaQq, FaWeibo } from 'react-icons/fa'
import  { Formik, Form, Field, ErrorMessage } from 'formik'
import* as Yup from 'yup'
import axios from 'axios'

function SignIn() {
  const initialValues = { email: '', password: ''};
  const handleSubmit = (values) => {
    axios.post('https://conduit.productionready.io/api/users/login', {
      "user": values
    }).then(function (response) {
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
  };
  const schema = Yup.object({
    email: Yup.string()
      .email("邮箱格式不正确！")
      .required("请输入邮箱！"),
    password: Yup.string()
      .required("请输入密码！")
  });
  return (
    <Box>
      <Formik 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        <Form>
          <Box>
            <Stack>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<FaEnvelopeOpen fontSize="16" color="#969696"/>} />
                <Field as={Input} pl="2.5rem" _focus="none" borderRadius="sm" bgColor="#b5b5b51a" size="md" fontSize={14} placeholder="邮箱" name="email" />
              </InputGroup>
              <ErrorMessage name="email">{msg => <FormHelperText fontSize="12px" color="#ea6f5a">{msg}</FormHelperText>}</ErrorMessage>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<FaLock fontSize="16" color="#969696"/>} />
                <Field as={Input} pl="2.5rem" _focus="none" borderRadius="sm" bgColor="#b5b5b51a" size="md" fontSize={14} placeholder="密码" name="password" />
              </InputGroup>
              <ErrorMessage name="password">{msg => <FormHelperText fontSize="12px" color="#ea6f5a">{msg}</FormHelperText>}</ErrorMessage>
            </Stack>
          </Box>
          <Flex mt="10px">
            <Checkbox color="#999" isFocusable="true" size="sm" colorScheme="blue" defaultIsChecked>
              记住我
            </Checkbox>
            <Spacer />
            <Link fontSize="14px" color="#999" _focus="none" _hover={{textDecoration: "none", color: "#333"}} href="#">登录遇到问题？</Link>
          </Flex>
          <Button type="submit" _hover={{bg: "#187cb7"}} bg="#3194d0" color="#fff" w="100%" size="sm" fontWeight={500} mt={4} borderRadius="2xl" _focus="none">登录</Button>
        </Form>
      </Formik>
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
          fontSize="12px" color="#969696" mb="10px">社交账号登录</Center>
        <Center>
          <Link href="#" _focus="none" mr="35px">
            <FaWeibo fontSize="28px" color="#e05244"/>
          </Link>
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

export default SignIn;
