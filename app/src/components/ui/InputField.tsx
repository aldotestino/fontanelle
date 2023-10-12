import { FormControl, FormControlProps, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { PRIMARY_COLOR } from '../../utils/theme';
import { UseFormRegisterReturn } from 'react-hook-form';

type InputFieldProps = FormControlProps & InputProps & {
  label: string
  register: UseFormRegisterReturn<'email' | 'password' | 'name' | 'surname'>
  errorString: string | undefined
}

function InputField({ label, isInvalid, errorString, register, type }: InputFieldProps) {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <Input {...register} type={type} focusBorderColor={`${PRIMARY_COLOR}.600`} />
      <FormErrorMessage>{errorString}</FormErrorMessage>
    </FormControl>
  );
}

export default InputField;