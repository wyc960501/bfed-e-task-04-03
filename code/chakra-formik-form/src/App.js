import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Box,
  Flex
} from "@chakra-ui/react"
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

function App() {
  return (
    <Box margin="auto" transform="translateY(30%)" bgColor="#fff" w={400} overflow="hidden" p="50px 50px 30px" boxShadow="lg" borderRadius="sm">
      <Tabs>
        <TabList mb="50px" border="none" color="#969696">
          <Flex align="center" m="0 auto">
            <Tab p="10px" _focus={{ boxShadow: "none"}} _selected={{color: '#ea6f5a', borderBottom: "2px solid #ea6f5a", fontWeight: "bold"}} fontSize="18px">登录</Tab>
            <Box p="10px">·</Box>
            <Tab  p="10px" _focus={{ boxShadow: "none"}} _selected={{color: '#ea6f5a', borderBottom: "2px solid #ea6f5a", fontWeight: "bold"}} fontSize="18px">注册</Tab>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <SignIn />
          </TabPanel>
          <TabPanel p="0">
            <SignUp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default App;
