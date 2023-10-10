import { FormControl, FormLabel, Input, Button, VStack, FormErrorMessage } from '@chakra-ui/react';
import AuthCard from './ui/AuthCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigninSchema, signinSchema } from '../utils/validators';
import { PRIMARY_COLOR } from '../utils/theme';

function Signin() {

  const { register, handleSubmit, formState: { errors, touchedFields }, } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit: SubmitHandler<SigninSchema> = (values) => {
    console.log(values);
  };

  return (
    <AuthCard 
      title='Signin' 
      description="Entra nel tuo account per utilizzare al meglio quest'app!" 
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack alignItems="start" spacing={2}>

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

          <Button mt={2} type='submit' colorScheme={PRIMARY_COLOR}>Signin</Button>
        </VStack>
      </form>
    </AuthCard>
  );
}

export default Signin;