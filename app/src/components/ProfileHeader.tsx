import { Avatar, HStack, Heading, Icon, Text, IconButton, Menu, MenuButton, MenuItem, MenuList, VStack, useToast } from '@chakra-ui/react';
import { ArrowLeftOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useUserStore } from '../stores/userStore';
import UserApi from '../api/userApi';

function ProfileHeader() {

  const toast = useToast(); 
  const { user, deleteUser } = useUserStore();

  async function handleSignout() { 
    const res = await UserApi.signout();
    if(res.status === 200) {
      deleteUser();
    }else {
      toast({
        position: 'top-right',
        title: 'Errore',
        description: res.data.message,
        status: 'error',
        isClosable: true,
      });
    }
  }

  return (
    <VStack w="full" alignItems="start">
      <HStack w="full" justifyContent="space-between">
        <HStack alignItems="end">
          <Avatar name={`${user?.name} ${user?.surname}`} src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}${user?.surname}&radius=50&backgroundColor=c0aede`} size="md" />
          <Heading size="xl">Ciao, {user?.name}</Heading>
        </HStack>
          
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label='Impostazioni'
            variant='ghost'
            icon={<Icon color="slate.900" as={Bars3Icon} w={6} h={6} />}
          />
          <MenuList>
            <MenuItem onClick={handleSignout} color="red.600" icon={<Icon as={ArrowLeftOnRectangleIcon} w={5} h={5} />}>Esci</MenuItem>
          </MenuList>
        </Menu>

      </HStack>
      <Text fontSize="lg" color="slate.500" fontWeight="bold">Le tue fontane</Text>
    </VStack>

  );
}

export default ProfileHeader;