import { Tab, TabProps } from '@chakra-ui/react';

type CustomTabProps = TabProps

function CustomTab({ children, ...rest }: CustomTabProps) {
  return (
    <Tab
      py={2}
      color="gray.500"
      fontWeight="semibold"
      _focus={{ outline: 'none' }}
      _selected={{ bg: 'white', color: 'gray.900', shadow: 'sm' }}
      rounded="lg"
      w="full"
      bg="transparent"
      border="none"
      {...rest}
    >
      {children}
    </Tab>
  );
}

export default CustomTab;