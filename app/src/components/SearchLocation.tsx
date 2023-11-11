import { useEffect, useState } from 'react';
import { Box, Icon, Input, InputGroup, InputGroupProps, InputLeftElement, Spinner, Text, VStack } from '@chakra-ui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchOption } from '../utils/types';
import { PRIMARY_COLOR } from '../utils/theme';
import { useQuery } from 'react-query';
import GeocoderApi from '../api/geocoderApi';

interface SearchLocationProps extends InputGroupProps {
  onSelectLocation: (value: SearchOption) => void
}

function SearchLocation({ onSelectLocation, ...r }: SearchLocationProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);

  const { isLoading, refetch } = useQuery([searchTerm], () => GeocoderApi.fromAddress(searchTerm), {
    enabled: false,
    onSuccess: (data) => {
      setSearchOptions(data);
    },
    onError: (err) => {
      console.error(err);
      setSearchOptions([]);
    }
  });

  useEffect(() => {
    if(searchTerm === '') {
      setSearchOptions([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  
  return (
    <InputGroup {...r}
      onFocus={() => setShowOptions(true)}
      zIndex={100}
      onBlur={(e) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
          if (!currentTarget.contains(document.activeElement)) {
            setShowOptions(false);
          }
        });
      }}
    >
      <InputLeftElement pointerEvents="none">
        {isLoading ? <Spinner size="sm" color="slate.500" /> : <Icon color="slate.500" as={MagnifyingGlassIcon} w={5} h={5} />}
      </InputLeftElement>
      <Input
        placeholder="Cerca una località"
        value={searchTerm}
        bg="gray.100"
        onChange={e => setSearchTerm(e.target.value)} 
        focusBorderColor={`${PRIMARY_COLOR}.600`} />
      {(searchOptions.length > 0 && showOptions) && 
      <VStack 
        zIndex={10}
        bg="white"
        maxH="200px"
        overflowY="scroll" 
        gap={0} 
        p={2} 
        borderRadius="lg" 
        boxShadow="lg" 
        align="start" 
        w="full" 
        position="absolute" 
        top={12}
      >
        {searchOptions.map((o, i) => 
          <Box onClick={(e) => {
            e.stopPropagation();
            setSearchTerm(o.label);
            onSelectLocation(o);
            setShowOptions(false);
          }}
          tabIndex={i} 
          key={i}
          borderRadius="md"
          w="full" 
          p={2}
          cursor="pointer"
          color="slate.500"
          fontWeight="semibold"
          _hover={{ bg: 'slate.100' }}
          >
            <Text>{o.label}</Text>
          </Box>)}
      </VStack>}
    </InputGroup>
  );
}

export default SearchLocation;