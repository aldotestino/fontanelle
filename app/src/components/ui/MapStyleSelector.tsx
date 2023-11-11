import { Avatar, HStack, Icon, IconButton, Text, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from '@chakra-ui/react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { mapStyles } from '../../utils/constants';

interface MapStyleSelectorProps {
  mapStyle: string
  setMapStyle: (mapStyle: string) => void
}

function MapStyleSelector({ mapStyle, setMapStyle }: MapStyleSelectorProps) {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={IconButton} icon={<Icon color="slate.900" as={AdjustmentsHorizontalIcon} w={6} h={6} />} aria-label="map style" />
      <MenuList borderRadius="lg" p={2}>
        <MenuOptionGroup
          title='Stile mappa'
          value={mapStyle}
          onChange={value => setMapStyle(value as string)}
          type='radio'
        >
          {mapStyles.map((style, index) => (
            <MenuItemOption p={2} borderRadius="md" _focus={{ bg: 'slate.100' }} key={index} value={style.value}>
              <HStack>
                <Avatar size="xs" src={style.image} />
                <Text>{style.label}</Text>
              </HStack>
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

export default MapStyleSelector;