import { HStack, VStack, Text, Icon, Box } from '@chakra-ui/react';
import { MapIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();

  console.log(location);

  return (
    <Box px={4} w="full" maxW="container.sm" left="50%" style={{ transform: 'translateX(-50%)' }} position="fixed" bottom={4}>
      <HStack w="full" py={2} justifyContent="space-around" bg="gray.100" rounded="2xl" shadow="sm">
        
        <VStack cursor="pointer" className='nav-button' onClick={() => navigate('/')} color={location.pathname === '/' ? 'gray.900' : 'gray.500'}>
          <Icon as={MapIcon} w={9} h={9} />
          <Text fontWeight="semibold" fontSize="lg">Mappa</Text>
        </VStack>

        <VStack cursor="pointer" className='nav-button' onClick={() => navigate('/profile')} color={location.pathname === '/profile' ? 'gray.900' : 'gray.500'}>
          <Icon as={UserCircleIcon} w={9} h={9} />
          <Text fontWeight="semibold" fontSize="lg">Profilo</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export default Navbar;