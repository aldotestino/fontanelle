import { TabList, TabListProps } from '@chakra-ui/react';

type CustomTabListProps = TabListProps

function CustomTabList({ children, ...rest }: CustomTabListProps) {
  return (
    <TabList bg="slate.50" p={1} rounded="lg" {...rest}>
      {children}
    </TabList>
  );
}

export default CustomTabList;