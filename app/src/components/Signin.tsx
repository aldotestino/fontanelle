import { Button, Divider, Text, HStack, VStack, useToast, Icon } from '@chakra-ui/react';
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
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation } from 'react-router-dom';
import { getGoogleUrl } from '../utils/google';

function Signin() {

  const toast = useToast();
  const { setUser } = useUserStore();

  const { register, handleSubmit, formState: { errors, touchedFields }, reset } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });

  const location = useLocation();
  const from = location.state?.pathname as string || '/';

  const signin = useMutation({
    mutationFn: UserApi.signin,
    onSuccess: (values: User) => {
      reset();
      setUser(values);
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
      title='Accedi' 
      description="Entra nel tuo account per utilizzare al meglio quest'app!" 
    >
      <VStack>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(values => signin.mutateAsync(values))}>
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
        <HStack w="full">
          <Divider borderColor="slate.200" />
          <Text color="slate.500">Oppure</Text>
          <Divider />
        </HStack>
        <Button as={Link} to={getGoogleUrl(from)} w="full" leftIcon={<Icon as={FcGoogle} w={6} h={6} />} variant="outline">Continua con Google</Button>
      </VStack>
    </AuthCard>
  );
}

export default Signin;