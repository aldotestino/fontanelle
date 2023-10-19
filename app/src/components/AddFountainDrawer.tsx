import { Button, Drawer, Text, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerProps, FormControl, FormErrorMessage, FormLabel, Icon, Select, VStack, HStack, Spinner, useToast } from '@chakra-ui/react';
import { GetFountainResponse, Location } from '../utils/types';
import InputField from './ui/InputField';
import { PRIMARY_COLOR } from '../utils/theme';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddPartialFountainSchema, addPartialFountainSchema } from '../utils/validators';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import GeocoderApi from '../api/geocoderApi';
import { useMutation, useQuery } from 'react-query';
import { useEffect } from 'react';
import FountainApi from '../api/fountainApi';
import { AxiosError } from 'axios';
import { queryClient } from '../api';

interface AddFountainDrawerProps {
  isOpen: DrawerProps['isOpen'];
  onClose: DrawerProps['onClose'];
  newFountainLocation: Location
}

function AddFountainDrawer({ isOpen, onClose, newFountainLocation }: AddFountainDrawerProps) {

  const toast = useToast();

  const { isLoading, refetch, data } = useQuery([JSON.stringify(newFountainLocation)], () => GeocoderApi.fromCoordinates(newFountainLocation), {
    enabled: false,
  });

  useEffect(() => {
    if(!newFountainLocation) return;
    refetch().catch(console.error);
  }, [newFountainLocation]);

  const { register, handleSubmit, formState: { errors, touchedFields }, reset } = useForm<AddPartialFountainSchema>({
    resolver: zodResolver(addPartialFountainSchema),
  });

  const addFountain = useMutation({
    mutationFn: FountainApi.addFountain,
    onMutate: () => {
      reset();
      onClose();
    },
    onSuccess: (data) => {
      const fountainsCache = queryClient.getQueryData<GetFountainResponse[]>(['fountains']);
      if(fountainsCache) {
        const newFountainsCache = [...fountainsCache, data];
        queryClient.setQueryData(['fountains'], newFountainsCache);
      }
      toast({
        position: 'top-right',
        title: 'Fontana aggiunta!',
        description: 'Puoi visualizzare la fontanta nel tuo profilo.',
        status: 'success',
        isClosable: true,
      });
    },
    onError: (error: AxiosError<{message: string}>) => {
      toast({
        position: 'top-right',
        title: 'Errore',
        description: error.response?.data.message,
        status: 'error',
        isClosable: true,
      });
    }
  });
  
  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <DrawerContent roundedTop="2xl">
        <DrawerCloseButton />
        <DrawerHeader>Aggiungi fontana</DrawerHeader>

        <DrawerBody pb={20}>
          <form onSubmit={handleSubmit(values => addFountain.mutateAsync({
            ...values,
            lat: newFountainLocation.lat,
            lng: newFountainLocation.lng,
            street: data.features[0].place_name
          }))}>
            <VStack alignItems="start" spacing={2}>
              <InputField
                label='Nome'
                isInvalid={touchedFields.name && !!errors.name} 
                errorString={errors.name?.message}
                register={register('name')}
              />

              <FormControl isInvalid={touchedFields.isFree && !!errors.isFree}>
                <FormLabel>Tipo</FormLabel>
                <Select {...register('isFree')} focusBorderColor={`${PRIMARY_COLOR}.600`}>
                  <option value="1">Gratuita</option>
                  <option value="0">A pagamento</option>
                </Select>
                <FormErrorMessage>{errors.isFree?.message}</FormErrorMessage>
              </FormControl>

              {isLoading ?
                <Spinner color={'slate.500'} size="sm" /> :
                data?.features[0]?.place_name ? 
                  <Text color="slate.500">{data.features[0].place_name}</Text> : 
                  <HStack color="red.500" spacing={1}>
                    <Icon as={ExclamationTriangleIcon} w={4} h={4}/>
                    <Text>Posizione non valida</Text>
                  </HStack>
              }
              
              <Button isDisabled={isLoading || !data?.features[0]?.place_name} isLoading={addFountain.isLoading} mt={2} type='submit' colorScheme={PRIMARY_COLOR}>Aggiungi</Button>
            </VStack>
          </form>
        </DrawerBody>
        
      </DrawerContent>
    </Drawer>
  );
}

export default AddFountainDrawer;