import { RefObject, useRef, useState } from 'react';
import Map, { MapRef, GeolocateControl, Marker, PointLike } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';
import { Location } from '../utils/types';
import { HStack, Icon, IconButton, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import AddFountainDrawer from '../components/AddFountainDrawer';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '../stores/userStore';
import MapStyleSelector from '../components/ui/MapStyleSelector';
import { mapStyles } from '../utils/constants';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { PRIMARY_COLOR } from '../utils/theme';
import FountainApi from '../api/fountainApi';
import { useQuery } from 'react-query';
import mapboxgl from 'mapbox-gl';
import FountainCard from '../components/ui/FountainCard';

function Home() {

  const { isAuth } = useUserStore();

  const mapRef = useRef<MapRef>() as RefObject<MapRef>;
  const geoControlRef = useRef<mapboxgl.GeolocateControl>() as RefObject<mapboxgl.GeolocateControl>;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newFountainLocation, setNewFountainLocation] = useState<Location | null>(null);

  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<string>(window.localStorage.getItem('mapStyle') || mapStyles[0].value);
  const [prevZoom, setPrevZoom] = useState<number>(14);

  const mapOffset = useBreakpointValue<PointLike>({ sm: [0, -200], md: [-100, 0] }, { ssr: false });

  const { data } = useQuery(['fountains'], FountainApi.getFountains, {
    refetchOnWindowFocus: false
  });

  const [selectedFountain, setSelectedFountain] = useState<number>(-1);

  function handleSetMapStyle(newMapStyle: string) {
    window.localStorage.setItem('mapStyle', newMapStyle);
    setMapStyle(newMapStyle);
  }

  function handleOnOpen(event: mapboxgl.MapLayerMouseEvent) {
    if(!isAuth) return;
    setSelectedFountain(-1); // TODO: probably not needed if onClick is impelemented on map
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

  function handleGeolocate() {
    setIsGeolocating(true);
    geoControlRef.current?.trigger();
  }

  function handleSelectFountain(index: number) {
    setSelectedFountain(index);
    setPrevZoom(mapRef.current?.getZoom() || 14);
    mapRef.current?.flyTo({
      duration: 2000,
      center: [data![index].lng, data![index].lat],
      offset: [0, -100],
      zoom: 20,
    });
  }

  // function handleUnselectFountain() {
  //   if(selectedFountain === -1) return;
  //   setSelectedFountain(-1);
  //   mapRef.current?.flyTo({
  //     duration: 2000,
  //     zoom: prevZoom
  //   });
  // }

  return (
    <>
      <Map
        reuseMaps
        ref={mapRef}
        dragRotate={false}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        mapStyle={mapStyle}
        style={{ width: '100vw', height: '100vh' }}
        onDblClick={handleOnOpen} // TODO: go back to onClick
      >
        {data && data.map((fountain, i) => (
          <Marker onClick={() => handleSelectFountain(i)} key={fountain.id} longitude={fountain.lng} latitude={fountain.lat}>
            <Icon as={MapPinIcon} w={9} h={9} color={i === selectedFountain ? 'indigo.600' : fountain.isFree ? 'blue.600' : 'green.600'} />
          </Marker>
        ))}

        {newFountainLocation !== null && 
          <Marker longitude={newFountainLocation.lng} latitude={newFountainLocation.lat}>
            <Icon as={MapPinIcon} w={9} h={9} color='red.600' />
          </Marker>
        }

        <GeolocateControl onGeolocate={() => setIsGeolocating(false)} ref={geoControlRef} style={{ display: 'none' }} />
      </Map>

      <HStack position="fixed" top={4} right={4}>
        <IconButton color={`${PRIMARY_COLOR}.600`} isLoading={isGeolocating} aria-label='geolocate' onClick={handleGeolocate} icon={<Icon as={GlobeAltIcon} w={6} h={6} />} />
        <MapStyleSelector mapStyle={mapStyle} setMapStyle={handleSetMapStyle} />
      </HStack>

      {(data && selectedFountain !== -1) && 
        <FountainCard {...data[selectedFountain]} />
      }

      <AddFountainDrawer isOpen={isOpen} onClose={handleOnClose} newFountainLocation={newFountainLocation!} />
    </>
  );
}

export default Home;  