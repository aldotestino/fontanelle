import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react';
import { MutableRefObject, useRef } from 'react';

interface ReportFountainAlertProps {
  onClose: () => void
  isOpen: boolean
  id: number
  name: string
}

function ReportFountainAlert({ onClose, isOpen, id, name }: ReportFountainAlertProps) {

  const cancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;

  function onSubmitReport() {
    console.log({ id });
    onClose();
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent mx={[4, 0]}>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Segnala fontana
          </AlertDialogHeader>

          <AlertDialogBody>
            Sei sicuro? Stai segnalando la fontana {name}.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Annulla
            </Button>
            <Button onClick={onSubmitReport} colorScheme='red' ml={3}>
              Segnala
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ReportFountainAlert;