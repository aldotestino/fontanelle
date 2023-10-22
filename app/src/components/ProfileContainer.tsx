import { BoxProps, VStack, Icon, Text, Center, Spinner } from '@chakra-ui/react';
import ProfileHeader from './ProfileHeader';
import { InboxIcon } from '@heroicons/react/24/outline';
import FountainApi from '../api/fountainApi';
import { useQuery } from 'react-query';
import { PRIMARY_COLOR } from '../utils/theme';
import UserFountainCard from './ui/UserFountainCard';

function ProfileContainer({ ...boxProps }: BoxProps) {

  const { data, isLoading } = useQuery(['my-fountains'], FountainApi.getUserFountains, {
    refetchOnWindowFocus: false
  });


  return (
    <VStack px={4} {...boxProps} alignItems="start" w="full" maxW="container.sm" overflowY="hidden">
      <ProfileHeader />

      {isLoading  ? 
        <Center w="full" pt="20%">
          <Spinner color={`${PRIMARY_COLOR}.600`} size="lg" />
        </Center> :
        data!.length === 0 ? 
          <VStack pt="20%" w="full" alignItems="center">
            <Icon color="slate.500" as={InboxIcon} w={12} h={12} />
            <Text textAlign="center" color="slate.500" fontWeight="bold">Non hai ancora aggiunto nessuna fontana</Text>
          </VStack> :
          <VStack spacing={4} w="full" flex="1 auto" height="0" overflowY="scroll">
            {data!.map(f => 
              <UserFountainCard key={f.id} {...f} />
            )}
          </VStack>
      }

    </VStack>
  );
}

export default ProfileContainer;
