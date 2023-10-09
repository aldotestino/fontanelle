import { Heading, VStack, Text, Box } from '@chakra-ui/react';
import {  ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode
  title: string
  description: string
}

function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <VStack alignItems="start" spacing={4} border="1px" borderColor="gray.100" shadow="sm" rounded="lg" p={4}>
      
      <VStack alignItems="start" spacing={1}>
        <Heading>{title}</Heading>
        <Text color="gray.500">
          {description}
        </Text>
      </VStack>
    
      <Box w="full">
        {children}
      </Box>
    </VStack>
  );
}

export default AuthCard;