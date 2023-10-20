import { GetFountainResponse } from '../../utils/types';
import { Box, Badge, HStack, Heading, Text, VStack, Icon, Button, IconButton, MenuItem, MenuList, Menu, MenuButton, useDisclosure } from '@chakra-ui/react';
import { PRIMARY_COLOR } from '../../utils/theme';
import { EllipsisVerticalIcon, ExclamationTriangleIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconFull } from '@heroicons/react/24/solid';
import ReportFountainModal from '../ReportFountainModal';
import VoteFountainModal from '../VoteFountainModal';
import { useUserStore } from '../../stores/userStore';

function FountainCard({ id, name, isFree, street, lat, lng }: GetFountainResponse) {

  const { isAuth } = useUserStore();

  const { isOpen: isOpenReport, onOpen: onOpenReport, onClose: onCloseReport } = useDisclosure();
  const { isOpen: isOpenVote, onOpen: onOpenVote, onClose: onCloseVote } = useDisclosure();

  function openMap(){
    window.open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${lng}`);
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
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} as={i < 4 ? StarIconFull : StarIcon} w={6} h={6} color={i < 4 ? 'yellow.500' : 'slate.500'} />
              ))}
              <Text ml={1} color="slate.500">4.3</Text>
            </HStack>
            {isAuth && <Menu placement="top-end" closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                aria-label='Impostazioni'
                variant='ghost'
                icon={<Icon as={EllipsisVerticalIcon} h={6} w={6} />}
              />
              <MenuList>
                <MenuItem onClick={onOpenVote} icon={<Icon as={StarIcon} w={5} h={5} />}>Valuta</MenuItem>
                <MenuItem onClick={onOpenReport} color="red.600" icon={<Icon as={ExclamationTriangleIcon} w={5} h={5} />}>Segnala</MenuItem>
              </MenuList>
            </Menu>}
          </HStack>
          <Button onClick={openMap} w="full" size="lg" colorScheme={PRIMARY_COLOR}>Raggiungi</Button>
        </VStack>
      </Box>

      <ReportFountainModal isOpen={isOpenReport} onClose={onCloseReport} name={name} id={id} />
      <VoteFountainModal isOpen={isOpenVote} onClose={onCloseVote} name={name} id={id} />
    </>
  );
}

export default FountainCard;