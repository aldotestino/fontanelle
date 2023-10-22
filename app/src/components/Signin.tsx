import { Button, VStack, useToast } from '@chakra-ui/react';
import AuthCard from './ui/AuthCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigninSchema, signinSchema } from '../utils/validators';
import { PRIMARY_COLOR } from '../utils/theme';
import InputField from './ui/InputField';
import { useMutation } from 'react-query';
import UserApi from '../api/userApi';
import { AxiosError } from 'axios';
import { User } from '../utils/types';
import { useUserStore } from '../stores/userStore';

function Signin() {

  const toast = useToast();
  const { setUser } = useUserStore();

  const { register, handleSubmit, formState: { errors, touchedFields }, reset } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });

  const signin = useMutation({
    mutationFn: UserApi.signin,
    onSuccess: (values: User) => {
      reset();
      setUser(values);
    },
    onError: (error: AxiosError<{message: string}>) => {
      reset();
      toast({
        variant: 'subtle',
        position: 'top-right',
        title: 'Errore',
        description: error.response?.data.message,
        status: 'error',
        isClosable: true,
      });
    }
  });
  
  return (
    <AuthCard 
      title='Accedi' 
      description="Entra nel tuo account per utilizzare al meglio quest'app!" 
    >
      <form onSubmit={handleSubmit(values => signin.mutateAsync(values))}>
        <VStack alignItems="start" spacing={2}>
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
          <Button isLoading={signin.isLoading} mt={2} type='submit' colorScheme={PRIMARY_COLOR}>Continua</Button>
        </VStack>
      </form>
    </AuthCard>
  );
}

export default Signin;