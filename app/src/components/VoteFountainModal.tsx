import { Text, Button, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody } from '@chakra-ui/react';
import { useState } from 'react';
import { PRIMARY_COLOR } from '../utils/theme';
import StarRating from './ui/StarRating';

interface ReportFountainModalProps {
  onClose: () => void
  isOpen: boolean
  id: number
  name: string
}

function VoteFountainModal({ onClose, isOpen, id, name }: ReportFountainModalProps) {

  const [rating, setRating] = useState(1);

  function handleOnClose() {
    setRating(1);
    onClose();
  }

  function onSubmitVote() {
    console.log({ id, rating });
    handleOnClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Valuta fontana</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Text alignSelf="start">Stai valutando la fontana {name}.</Text>
            <StarRating rating={rating} setRating={setRating} />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={onSubmitVote} colorScheme={PRIMARY_COLOR}>Valuta</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default VoteFountainModal;