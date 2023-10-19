import { AlertDialog, AlertDialogBody, Text, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, VStack } from '@chakra-ui/react';
import { MutableRefObject, useRef, useState } from 'react';
import { PRIMARY_COLOR } from '../utils/theme';
import StarRating from './ui/StarRating';

interface ReportFountainAlertProps {
  onClose: () => void
  isOpen: boolean
  id: number
  name: string
}

function VoteFountainAlert({ onClose, isOpen, id, name }: ReportFountainAlertProps) {

  const cancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;
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
    <AlertDialog
      isOpen={isOpen}
      onClose={handleOnClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent mx={[4, 0]}>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Valuta fontana
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack spacing={4}>
              <Text alignSelf="start">Stai valutando la fontana {name}.</Text>
              <StarRating rating={rating} setRating={setRating} />
            </VStack>

          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleOnClose}>
              Annulla
            </Button>
            <Button onClick={onSubmitVote} colorScheme={PRIMARY_COLOR} ml={3}>
              Valuta
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default VoteFountainAlert;