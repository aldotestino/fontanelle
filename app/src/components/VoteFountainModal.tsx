import { Text, Button, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { PRIMARY_COLOR } from '../utils/theme';
import StarRating from './ui/StarRating';
import { useMutation } from 'react-query';
import FountainApi from '../api/fountainApi';
import { AxiosError } from 'axios';
import { queryClient } from '../api';
import { GetFountainResponse } from '../utils/types';

interface ReportFountainModalProps {
  onClose: () => void
  isOpen: boolean
  id: number
  name: string
}

function VoteFountainModal({ onClose, isOpen, id, name }: ReportFountainModalProps) {

  const toast = useToast();

  const [stars, setStars] = useState(1);

  function handleOnClose() {
    setStars(1);
    onClose();
  }

  const voteFountain = useMutation({
    mutationFn: FountainApi.voteFountain,
    onMutate: () => {
      handleOnClose();
    },
    onSuccess: (data) => {
      console.log(data);
      const fountainsCache = queryClient.getQueryData<GetFountainResponse[]>(['fountains']);
      if(fountainsCache) {
        const newFountainsCache = fountainsCache.map(fountain => {
          if(fountain.id === id) {
            return {
              ...fountain,
              stars: data.stars,
            };
          }
          return fountain;
        });
        queryClient.setQueryData(['fountains'], newFountainsCache);
      }
    },
    onError: (error: AxiosError<{error: string}>) => {
      toast({
        variant: 'subtle',
        position: 'top-right',
        title: 'Errore',
        description: error.response?.data?.error,
        status: 'error',
        isClosable: true,
      });
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mx={[4, 0]}>
        <ModalHeader fontSize="xl" px={4} pb={2}>Valuta fontana</ModalHeader>
        <ModalBody py={0} px={4}>
          <VStack spacing={2}>
            <Text alignSelf="start">Stai valutando la fontana {name}.</Text>
            <StarRating stars={stars} setStars={setStars} />
          </VStack>
        </ModalBody>

        <ModalFooter px={4}>
          <Button mr={3} onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={() => voteFountain.mutateAsync({ fountainId: id, stars })} colorScheme={PRIMARY_COLOR}>Valuta</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default VoteFountainModal;