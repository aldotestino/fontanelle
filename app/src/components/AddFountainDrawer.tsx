import { Button, Drawer, Text, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerProps, FormControl, FormErrorMessage, FormLabel, Icon, Select, VStack, HStack, Spinner, useBreakpointValue, BorderProps, useToast } from '@chakra-ui/react';
import { Location } from '../utils/types';
import InputField from './ui/InputField';
import { PRIMARY_COLOR } from '../utils/theme';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddPartialFountainSchema, addPartialFountainSchema } from '../utils/validators';
import { ExclamationTriangleIcon, MapPinIcon } from '@heroicons/react/24/outline';
import GeocoderApi from '../api/geocoderApi';
import { useMutation, useQuery } from 'react-query';
import { useEffect } from 'react';
import FountainApi from '../api/fountainApi';
import { AxiosError } from 'axios';

interface AddFountainDrawerProps {
  isOpen: DrawerProps['isOpen'];
  onClose: DrawerProps['onClose'];
  newFountainLocation: Location
}

function AddFountainDrawer({ isOpen, onClose, newFountainLocation }: AddFountainDrawerProps) {

  const toast = useToast();

  const positionVariant = useBreakpointValue<DrawerProps['placement']>({ sm: 'bottom', md: 'right' }, { ssr: false });
  const roundedVariant = useBreakpointValue<BorderProps['roundedTop']>({ sm: '2xl', md: 'none' }, { ssr: false });

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
    onSuccess: () => {
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
      placement={positionVariant}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <DrawerContent roundedTop={roundedVariant}>
        <DrawerCloseButton />
        <DrawerHeader>Aggiungi fontana</DrawerHeader>

        <DrawerBody pb={40}>
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
                  <HStack color="slate.500" spacing={1}>
                    <Icon as={MapPinIcon} w={4} h={4}/>
                    <Text>{data.features[0].place_name}</Text>
                  </HStack> : 
                  <HStack color="red.500" spacing={1}>
                    <Icon as={ExclamationTriangleIcon} w={4} h={4}/>
                    <Text>Invalid location</Text>
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