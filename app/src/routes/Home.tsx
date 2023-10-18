import { RefObject, useRef, useState } from 'react';
import Map, { MapRef, Marker, PointLike } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';
import { Location } from '../utils/types';
import { Icon, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import AddFountainDrawer from '../components/AddNewFountainDrawer';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '../stores/userStore';
import MapStyleSelector from '../components/ui/MapStyleSelector';
import { mapStyles } from '../utils/constants';

function Home() {

  const { isAuth } = useUserStore();

  const mapRef = useRef<MapRef>() as RefObject<MapRef>;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newFountainLocation, setNewFountainLocation] = useState<Location | null>(null);

  const [mapStyle, setMapStyle] = useState<string>(window.localStorage.getItem('mapStyle') || mapStyles[0].value);
  const [prevZoom, setPrevZoom] = useState<number>(14);

  const mapOffset = useBreakpointValue<PointLike>({ sm: [0, -200], md: [-100, 0] }, { ssr: false });

  function handleSetMapStyle(newMapStyle: string) {
    window.localStorage.setItem('mapStyle', newMapStyle);
    setMapStyle(newMapStyle);
  }

  function handleOnOpen(event: mapboxgl.MapLayerMouseEvent) {
    if(!isAuth) return;
    const { lat, lng } = event.lngLat;
    setPrevZoom(mapRef.current?.getZoom() || 14);
    mapRef.current?.flyTo({
      duration: 2000,
      center: [lng, lat],
      offset: mapOffset,
      zoom: 20,
    });
    setNewFountainLocation({ lat, lng });
    onOpen();
  }

  function handleOnClose() {
    setNewFountainLocation(null);
    mapRef.current?.flyTo({
      duration: 2000,
      zoom: prevZoom
    });
    onClose();
  }

  return (
    <>
      <Map
        ref={mapRef}
        dragRotate={false}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        mapStyle={mapStyle}
        style={{ width: '100vw', height: '100vh' }}
        onClick={handleOnOpen}
        initialViewState={{
          // Italy coordinates
          longitude: 12.5674,
          latitude: 41.8719,
          zoom: 6,
        }}
      >
        {newFountainLocation !== null && 
        <Marker longitude={newFountainLocation.lng} latitude={newFountainLocation.lat}>
          <Icon as={MapPinIcon} w={9} h={9} color='red.500' />
        </Marker>}
      </Map>

      <MapStyleSelector mapStyle={mapStyle} setMapStyle={handleSetMapStyle} />
      <AddFountainDrawer isOpen={isOpen} onClose={handleOnClose} newFountainLocation={newFountainLocation!} />
    </>
  );
}

export default Home;  