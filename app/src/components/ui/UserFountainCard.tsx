import { HStack, Heading, Icon, VStack, Text } from '@chakra-ui/react';
import {  GetUserFountainResponse } from '../../utils/types';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link as RLink } from 'react-router-dom';

function UserFountainCard({ id, name, street }: GetUserFountainResponse) {
  return (
    <HStack cursor="pointer" as={RLink} to={`/?fountainId=${id}`} w="full" bg="slate.50" border="1px" borderColor="slate.100" rounded="2xl" shadow="sm" p={4} justifyContent="space-between">
      <VStack alignItems="start">
        <Heading size={['md', 'lg']}>{name}</Heading>
        <Text color="slate.500">{street}</Text>
      </VStack>
      <Icon color="slate.500" as={ChevronRightIcon} h={6} w={6}/>
    </HStack>
  );
}

export default UserFountainCard;