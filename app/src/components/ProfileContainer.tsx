import { BoxProps, VStack, Icon, Text } from '@chakra-ui/react';
import ProfileHeader from './ProfileHeader';
import { InboxIcon } from '@heroicons/react/24/outline';

// const fountains = Array(50).fill(1);

function ProfileContainer({ ...boxProps }: BoxProps) {

  return (
    <VStack px={4} {...boxProps} alignItems="start" w="full" maxW="container.sm" overflowY="hidden">
      <ProfileHeader />


      <VStack pt="20%" w="full" alignItems="center">
        <Icon color="slate.500" as={InboxIcon} w={12} h={12} />
        <Text textAlign="center" color="slate.500" fontWeight="bold">Non hai ancora aggiunto nessuna fontana</Text>
      </VStack>


      {/* <Box flexGrow={1} w="full" maxH={40} bg="red.500" overflowY="scroll">
        {fountains.map((_, i) => <p key={i}>{i}</p>)}
      </Box> */}

    </VStack>
  );
}

export default ProfileContainer;
