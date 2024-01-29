import { Button, FormControl, FormErrorMessage, FormLabel, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useToast } from '@chakra-ui/react';
import { PRIMARY_COLOR } from '../utils/theme';
import { useForm } from 'react-hook-form';
import { ReportPartialFountainSchema, reportPartialFountainSchema } from '../utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { queryClient } from '../api';
import { GetFountainResponse } from '../utils/types';
import FountainApi from '../api/fountainApi';
import { AxiosError } from 'axios';

interface ReportFountainModalProps {
  onClose: () => void
  isOpen: boolean
  id: number
  name: string
}

function ReportFountainModal({ onClose, isOpen, id, name }: ReportFountainModalProps) {

  const { register, handleSubmit, formState: { errors, touchedFields }, reset } = useForm<ReportPartialFountainSchema>({
    resolver: zodResolver(reportPartialFountainSchema),
  });

  const toast = useToast();

  const reportFountain = useMutation({
    mutationFn: FountainApi.reportFountain,
    onMutate: () => {
      reset();
      onClose();
    },
    onSuccess: (data) => {
      const fountainsCache = queryClient.getQueryData<GetFountainResponse[]>(['fountains']);
      if(fountainsCache) {
        const newFountainsCache = fountainsCache.map(fountain => {
          if(fountain.id === id) {
            fountain.reports[data.reason]++;
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
      <form onSubmit={handleSubmit(({ reason }) => reportFountain.mutateAsync({ fountainId: id, reason }))}>
        <ModalContent mx={[4, 0]}>
          <ModalHeader fontSize="xl" px={4} pb={2}>Segnala fontana</ModalHeader>
          <ModalBody py={0} px={4}>
            Sei sicuro? Stai segnalando la fontana {name}.
            <FormControl mt={2} isInvalid={touchedFields.reason && !!errors.reason}>
              <FormLabel>Motivo della segnalazione:</FormLabel>
              <Select {...register('reason')} focusBorderColor={`${PRIMARY_COLOR}.600`}>
                <option value="1">Mancanza di manutenzione</option>
                <option value="2">Qualità dell'acqua compromessa</option>
                <option value="3">Rotture o danni strutturali</option>
                <option value="4">Accesso limitato o insufficiente</option>
                <option value="5">Mancanza di igiene e pulizia</option>
              </Select>
              <FormErrorMessage>{errors.reason?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter px={4}>
            <Button mr={3} onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit" colorScheme="red">Segnala</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default ReportFountainModal;