import { HStack, Button, VStack, useToast } from '@chakra-ui/react';
import AuthCard from './ui/AuthCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, signupSchema } from '../utils/validators';
import { PRIMARY_COLOR } from '../utils/theme';
import InputField from './ui/InputField';
import { useMutation } from 'react-query';
import UserApi from '../api/userApi';
import { AxiosError } from 'axios';

function Signup() {

  const toast = useToast();

  const { register, handleSubmit, formState: { errors, touchedFields }, reset } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const signup = useMutation({
    mutationFn: UserApi.signup,
    onSuccess: () => {
      reset();
      toast({
        variant: 'subtle',
        position: 'top-right',
        title: 'Registrazione completata!',
        description: 'Ora puoi effettuare il login.',
        status: 'success',
        isClosable: true,
      });
    },
    onError: (error: AxiosError<{error: string}>) => {
      reset();
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
    <AuthCard 
      title='Registrati' 
      description='Crea un account per aggiungere e valutare fontanelle nel mondo!' 
    >
      <form onSubmit={handleSubmit(values => signup.mutateAsync(values))}>
        <VStack alignItems="start" spacing={2}>
          <HStack>
            <InputField 
              label='Nome'
              isInvalid={touchedFields.name && !!errors.name}
              errorString={errors.name?.message}
              register={register('name')}
              type='name'
            />
            <InputField 
              label='Cognome'
              isInvalid={touchedFields.surname && !!errors.surname}
              errorString={errors.surname?.message}
              register={register('surname')}
              type='surname'
            />
          </HStack>
          <InputField
            label='Email'
            isInvalid={touchedFields.email && !!errors.email} 
            errorString={errors.email?.message}
            register={register('email')}
          />
          <InputField 
            label='Password'
            isInvalid={touchedFields.password && !!errors.password}
            errorString={errors.password?.message}
            register={register('password')}
            type='password'
          />
          <Button isLoading={signup.isLoading} mt={2} type='submit' colorScheme={PRIMARY_COLOR}>Continua</Button>
        </VStack>
      </form>
    </AuthCard>
  );
}

export default Signup;