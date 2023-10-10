import { Box, BoxProps, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import CustomTabList from './ui/CustomTabList';
import CustomTab from './ui/CustomTab';
import Signup from './Signup';
import Signin from './Signin';

function AuthContainer({ ...boxProps }: BoxProps) {
  return (
    <Box {...boxProps} maxW="md" w="full">
      <Tabs variant="unstyled" defaultIndex={1}>
        <CustomTabList>
          <CustomTab>Signup</CustomTab>
          <CustomTab>Signin</CustomTab>
        </CustomTabList>
        <TabPanels>
          <TabPanel p={0} mt={4}>
            <Signup/>
          </TabPanel>
          <TabPanel p={0} mt={4}>
            <Signin/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default AuthContainer;