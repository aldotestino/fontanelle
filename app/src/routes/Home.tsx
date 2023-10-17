import { RefObject, useEffect, useRef, useState } from 'react';
import Map, { MapRef, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';
import { Location } from '../utils/types';
import { Icon, useDisclosure } from '@chakra-ui/react';
import AddFountainDrawer from '../components/AddNewFountainDrawer';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '../stores/userStore';
import MapStyleSelector from '../components/ui/MapStyleSelector';

function Home() {

  const { isAuth } = useUserStore();

  const mapRef = useRef<MapRef>() as RefObject<MapRef>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newFountainLocation, setNewFountainLocation] = useState<Location | null>(null);

  const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/dark-v11');
  const [prevZoom, setPrevZoom] = useState<number>(14);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: prevZoom,
      });
    });
  }, []);

  function handleOnOpen(event: mapboxgl.MapLayerMouseEvent) {
    if(!isAuth) return;
    const { lat, lng } = event.lngLat;
    setPrevZoom(mapRef.current?.getZoom() || 14);
    mapRef.current?.flyTo({
      center: [lng, lat],
      offset: [0, -200],
      zoom: 20,
    });
    setNewFountainLocation({ lat, lng });
    onOpen();
  }

  function handleOnClose() {
    setNewFountainLocation(null);
    mapRef.current?.flyTo({
      zoom: prevZoom
    });
    onClose();
  }

  return (
    <>
      <Map
        reuseMaps 
        ref={mapRef}
        dragRotate={false}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        mapStyle={mapStyle}
        style={{ width: '100vw', height: '100vh' }}
        onClick={handleOnOpen}
      >
        {newFountainLocation !== null && 
        <Marker longitude={newFountainLocation.lng} latitude={newFountainLocation.lat}>
          <Icon as={MapPinIcon} w={9} h={9} color='red.500' />
        </Marker>}
      </Map>

      <MapStyleSelector mapStyle={mapStyle} setMapStyle={setMapStyle} />

      <AddFountainDrawer isOpen={isOpen} onClose={handleOnClose} newFountainLocation={newFountainLocation!} />
    </>
  );
}

export default Home;  