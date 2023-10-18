import { GetFountainResponse } from '../../utils/types';
import { Box, Badge, HStack, Heading, Text, VStack, Icon, Button } from '@chakra-ui/react';
import { PRIMARY_COLOR } from '../../utils/theme';
import { StarIcon } from '@heroicons/react/24/outline';

function FountainCard({ name, isFree, street }: GetFountainResponse) {
  return (
    <Box px={4} w="full" maxW="container.sm" left="50%" style={{ transform: 'translateX(-50%)' }} position="fixed" bottom={28} zIndex={10}>
      <VStack spacing={2} w="full" p={4} alignItems="start" bg="slate.50" border="1px" borderColor="slate.100" rounded="2xl" shadow="sm">
        <HStack w="full" justifyContent="space-between" alignItems="start">
          <Heading size={['md', 'lg']}>{name}</Heading>
          <Badge rounded="full" colorScheme={isFree ? 'blue' : 'green'}>{isFree ? 'Gratuita': 'A pagamento'}</Badge>
        </HStack>
        <Text color="slate.500">{street}</Text>
        <HStack spacing={0}>
          {Array.from({ length: 5 }, (_, i) => (
            // TODO implement rating
            <Icon key={i} as={StarIcon} w={6} h={6} color={i < 4 ? 'yellow.500' : 'gray.400'} />
          ))}
        </HStack>
        <Button w="full" size="lg" colorScheme={PRIMARY_COLOR}>Raggiungi</Button>
      </VStack>
    </Box>
  );
}

export default FountainCard;