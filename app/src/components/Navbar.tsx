import { HStack, VStack, Text, Icon, Box } from '@chakra-ui/react';
import { MapIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box px={4} w="full" maxW="container.sm" left="50%" style={{ transform: 'translateX(-50%)' }} position="fixed" bottom={4} zIndex={10}>
      <HStack w="full" py={2} justifyContent="space-around" bg="slate.50" border="1px" borderColor="slate.100" rounded="2xl" shadow="sm">
        
        <VStack spacing={0} cursor="pointer" className='nav-button' onClick={() => navigate('/')} color={location.pathname === '/' ? 'slate.900' : 'slate.500'}>
          <Icon as={MapIcon} w={9} h={9} />
          <Text fontWeight="semibold" fontSize="lg">Mappa</Text>
        </VStack>

        <VStack spacing={0} cursor="pointer" className='nav-button' onClick={() => navigate('/profile')} color={location.pathname === '/profile' ? 'slate.900' : 'slate.500'}>
          <Icon as={UserCircleIcon} w={9} h={9} />
          <Text fontWeight="semibold" fontSize="lg">Profilo</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export default Navbar;