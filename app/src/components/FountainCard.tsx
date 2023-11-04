import { GetFountainResponse } from '../utils/types';
import { Box, Badge, HStack, Heading, Text, VStack, Button, useDisclosure } from '@chakra-ui/react';
import { PRIMARY_COLOR } from '../utils/theme';
import ReportFountainModal from './ReportFountainModal';
import VoteFountainModal from './VoteFountainModal';
import ReportsAccordion from './ui/ReportsAccordion';
import FountainCardMenu from './FountainCardMenu';
import Stars from './ui/Stars';

function FountainCard({ id, name, isFree, street, lat, lng, stars = 0, reports }: GetFountainResponse) {

  const { isOpen: isOpenReport, onOpen: onOpenReport, onClose: onCloseReport } = useDisclosure();
  const { isOpen: isOpenVote, onOpen: onOpenVote, onClose: onCloseVote } = useDisclosure();

  function openMap(){
    window.open(`https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${lat},${lng}`);
  }

  return (
    <>
      <Box px={4} w="full" maxW="container.sm" left="50%" style={{ transform: 'translateX(-50%)' }} position="fixed" bottom={28} zIndex={10}>
        <VStack spacing={2} w="full" p={4} alignItems="start" bg="slate.50" border="1px" borderColor="slate.100" rounded="2xl" shadow="sm">
          <HStack w="full" justifyContent="space-between" alignItems="start">
            <Heading size={['md', 'lg']}>{name}</Heading>
            <Badge rounded="full" colorScheme={isFree ? 'blue' : 'green'}>{isFree ? 'Gratuita': 'A pagamento'}</Badge>
          </HStack>
          <Text color="slate.500">{street}</Text>
          <HStack minH={10} w="full" justifyContent="space-between">
            <HStack spacing={0}>
              <Stars stars={stars} />
              <Text ml={1} color="slate.500">{stars.toFixed(1)}</Text>
            </HStack>
            <FountainCardMenu id={id} name={name} onOpenReport={onOpenReport} onOpenVote={onOpenVote} />
          </HStack>
          
          <ReportsAccordion reports={reports} />

          <Button onClick={openMap} w="full" size="lg" colorScheme={PRIMARY_COLOR}>Raggiungi</Button>
        </VStack>
      </Box>

      <ReportFountainModal isOpen={isOpenReport} onClose={onCloseReport} name={name} id={id} />
      <VoteFountainModal isOpen={isOpenVote} onClose={onCloseVote} name={name} id={id} />
    </>
  );
}

export default FountainCard;