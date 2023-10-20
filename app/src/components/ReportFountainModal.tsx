import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
interface ReportFountainModalProps {
  onClose: () => void
  isOpen: boolean
  id: number
  name: string
}

function ReportFountainModal({ onClose, isOpen, id, name }: ReportFountainModalProps) {

  function onSubmitReport() {
    console.log({ id });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mx={[4, 0]}>
        <ModalHeader fontSize="xl" px={4} pb={2}>Segnala fontana</ModalHeader>
        <ModalBody py={0} px={4}>
          Sei sicuro? Stai segnalando la fontana {name}.
        </ModalBody>

        <ModalFooter px={4}>
          <Button mr={3} onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={onSubmitReport} colorScheme="red">Segnala</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReportFountainModal;