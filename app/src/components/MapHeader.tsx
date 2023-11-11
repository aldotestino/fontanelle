import { Alert, AlertDescription, AlertIcon, HStack, Icon, IconButton, Tooltip, VStack } from '@chakra-ui/react';
import SearchLocation from './SearchLocation';
import MapStyleSelector from './ui/MapStyleSelector';
import { GlobeAltIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { PRIMARY_COLOR } from '../utils/theme';
import { SearchOption } from '../utils/types';
import { useUserStore } from '../stores/userStore';
import { Dispatch, SetStateAction } from 'react';

interface MapHeaderProps {
  isAddingFountain: boolean
  setIsAddingFountain: Dispatch<SetStateAction<boolean>>
  isGeolocating: boolean
  handleGeolocate: () => void
  mapStyle: string
  handleSetMapStyle: (mapStyle: string) => void
  selectedFountain: number
  onSelectLocation: (value: SearchOption) => void
}

function MapHeader({ onSelectLocation, handleGeolocate, isGeolocating, isAddingFountain, selectedFountain, setIsAddingFountain, mapStyle, handleSetMapStyle  }: MapHeaderProps) {

  const { isAuth } = useUserStore();

  return (
    <VStack align="end" position="fixed" top={0} pt={4} px={4} w="full">
      <HStack w="full" justifyContent="end" alignItems="start">
        <SearchLocation w="full" maxW="xs"  onSelectLocation={onSelectLocation} />
        <Tooltip label='Trova la mia posizione'>
          <IconButton color={`${PRIMARY_COLOR}.600`} isLoading={isGeolocating} aria-label='geolocate' onClick={handleGeolocate} icon={<Icon as={GlobeAltIcon} w={6} h={6} />} />
        </Tooltip>
        {isAuth && <Tooltip label={isAddingFountain ? 'Seleziona fonatanella' : 'Aggiungi fontanella'}>
          <IconButton isDisabled={selectedFountain !== -1} color={isAddingFountain ? `${PRIMARY_COLOR}.600` : 'slate.900'} aria-label='add fountain' onClick={() => setIsAddingFountain(pv => !pv)} icon={<Icon as={PlusCircleIcon} w={6} h={6} />} />
        </Tooltip>}
        <MapStyleSelector mapStyle={mapStyle} setMapStyle={handleSetMapStyle} />
      </HStack>
        
      {isAddingFountain &&
          <Alert w="full" maxW="lg" variant="subtle" borderRadius="lg" status="info">
            <AlertIcon />
            <AlertDescription>Premi un punto sulla mappa per aggiungere una fontanella</AlertDescription>
          </Alert>
      }
    </VStack>
  );
}

export default MapHeader;