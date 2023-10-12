import { HStack, Button, VStack } from '@chakra-ui/react';
import AuthCard from './ui/AuthCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, signupSchema } from '../utils/validators';
import { PRIMARY_COLOR } from '../utils/theme';
import InputField from './ui/InputField';

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
          <Button mt={2} type='submit' colorScheme={PRIMARY_COLOR}>Signup</Button>
        </VStack>
      </form>
    </AuthCard>
  );
}

export default Signup;