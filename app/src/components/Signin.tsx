import { Button, VStack } from '@chakra-ui/react';
import AuthCard from './ui/AuthCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SigninSchema, signinSchema } from '../utils/validators';
import { PRIMARY_COLOR } from '../utils/theme';
import InputField from './ui/InputField';

function Signin() {

  const { register, handleSubmit, formState: { errors, touchedFields }, } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit: SubmitHandler<SigninSchema> = (values) => {
    console.log(values);
  };

  return (
    <AuthCard 
      title='Accedi' 
      description="Entra nel tuo account per utilizzare al meglio quest'app!" 
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button mt={2} type='submit' colorScheme={PRIMARY_COLOR}>Continua</Button>
        </VStack>
      </form>
    </AuthCard>
  );
}

export default Signin;