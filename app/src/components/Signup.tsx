import { FormControl, FormLabel, Input, HStack, Button, VStack, FormErrorMessage } from '@chakra-ui/react';
import AuthCard from './ui/AuthCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, signupSchema } from '../utils/validators';
import { PRIMARY_COLOR } from '../utils/theme';

function Signup() {

  const { register, handleSubmit, formState: { errors, touchedFields }, } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = (values) => {
    console.log(values);
  };

  return (
    <AuthCard 
      title='Signup' 
      description='Crea un account per aggiungere e valutare fontanelle nel mondo!' 
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack alignItems="start" spacing={2}>
          <HStack>
            <FormControl isInvalid={touchedFields.name && !!errors.name}>
              <FormLabel>Nome</FormLabel>
              <Input {...register('name')} focusBorderColor={`${PRIMARY_COLOR}.600`} type='text' />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={touchedFields.surname && !!errors.surname}>
              <FormLabel>Cognome</FormLabel>
              <Input {...register('surname')} focusBorderColor={`${PRIMARY_COLOR}.600`} type='text' />
              <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
            </FormControl>
          </HStack>

          <FormControl isInvalid={touchedFields.email && !!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input {...register('email')} focusBorderColor={`${PRIMARY_COLOR}.600`} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={touchedFields.password && !!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input {...register('password')} focusBorderColor={`${PRIMARY_COLOR}.600`} type='password' />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button mt={2} type='submit' colorScheme={PRIMARY_COLOR}>Signup</Button>
        </VStack>
      </form>
    </AuthCard>
  );
}

export default Signup;