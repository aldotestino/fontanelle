import { RefObject, useEffect, useRef, useState } from 'react';
import Map, { MapRef, GeolocateControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';
import { Location, SearchOption } from '../utils/types';
import { Center, Icon, Spinner, useDisclosure } from '@chakra-ui/react';
import AddFountainDrawer from '../components/AddFountainDrawer';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '../stores/userStore';
import { FLY_TO_DURATION, mapStyles } from '../utils/constants';
import { PRIMARY_COLOR } from '../utils/theme';
import FountainApi from '../api/fountainApi';
import { useQuery } from 'react-query';
import mapboxgl from 'mapbox-gl';
import FountainCard from '../components/FountainCard';
import { useLocation } from 'react-router-dom';
import MapHeader from '../components/MapHeader';

function Home() {

  const { isAuth } = useUserStore();

  const mapRef = useRef<MapRef>(null) as RefObject<MapRef>;
  const geoControlRef = useRef<mapboxgl.GeolocateControl>() as RefObject<mapboxgl.GeolocateControl>;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newFountainLocation, setNewFountainLocation] = useState<Location | null>(null);

  const [isAddingFountain, setIsAddingFountain] = useState<boolean>(false);

  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<string>(window.localStorage.getItem('mapStyle') || mapStyles[0].value);
  const [prevZoom, setPrevZoom] = useState<number>(14);

  const [selectedFountain, setSelectedFountain] = useState<number>(-1);

  const location = useLocation();

  const { data, isLoading } = useQuery(['fountains'], FountainApi.getFountains, {
    refetchOnWindowFocus: false,
  });

  function handleFountainIdInUrl() {
    const fountainId = location.search.split('?fountainId=')[1];
    const index = data?.findIndex(fountain => fountain.id === parseInt(fountainId));
    if(index !== undefined && index !== -1) {
      setSelectedFountain(index);
      return true;
    }
    return false;
  }

  useEffect(() => {
    handleFountainIdInUrl();
  }, [location.search]);

  useEffect(() => {
    if(selectedFountain !== -1) {
      mapRef.current?.flyTo({
        duration: FLY_TO_DURATION,
        center: [data![selectedFountain].lng, data![selectedFountain].lat],
        offset: [0, -200],
        zoom: 20,
      });
    }
  }, [selectedFountain]);

  function onLoad() {
    const fountainIdInUrl = handleFountainIdInUrl();
    if(!fountainIdInUrl) {
    //center map on italy coordinates
      mapRef.current?.setCenter([12.5674, 41.8719]);
      mapRef.current?.setZoom(4);
    }
  }

  function handleSetMapStyle(newMapStyle: string) {
    window.localStorage.setItem('mapStyle', newMapStyle);
    setMapStyle(newMapStyle);
  }

  function handleOnMapClick(event: mapboxgl.MapLayerMouseEvent) {
    if(event.originalEvent.target !== mapRef.current?.getCanvas()) return;
    if(selectedFountain === -1 && isAddingFountain) handleOnOpen({ lat: event.lngLat.lat, lng: event.lngLat.lng });
    else handleUnselectFountain();
  }
  
  function handleOnOpen({ lat, lng }: Location) {
    if(!isAuth) return;
    setPrevZoom(mapRef.current?.getZoom() || 14);
    mapRef.current?.flyTo({
      duration: FLY_TO_DURATION,
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
      duration: FLY_TO_DURATION,
      zoom: prevZoom
    });
    onClose();
  }

  function handleGeolocate() {
    setIsGeolocating(true);
    geoControlRef.current?.trigger();
  }

  function handleSelectFountain(index: number) {
    if(isAddingFountain) return;
    setSelectedFountain(index);
    setPrevZoom(mapRef.current?.getZoom() || 14);
    mapRef.current?.flyTo({
      duration: FLY_TO_DURATION,
      center: [data![index].lng, data![index].lat],
      offset: [0, -100],
      zoom: 20,
    });
  }

  function handleUnselectFountain() {
    setSelectedFountain(-1);
    mapRef.current?.flyTo({
      duration: FLY_TO_DURATION,
      zoom: prevZoom
    });
  }

  if(isLoading) {
    return (
      <Center h="100vh">
        <Spinner color={`${PRIMARY_COLOR}.600`} size="lg" />
      </Center>
    );
  }

  function onSelectLocation(location: SearchOption) {
    mapRef.current?.flyTo({
      duration: FLY_TO_DURATION,
      center: [location.lng, location.lat],
      zoom: location.placeType === 'place' ? 12 : 18
    });
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
        onLoad={onLoad}
        onClick={handleOnMapClick}
      >
        {data && data.map((fountain, i) => (
          <Marker onClick={() => handleSelectFountain(i)} key={fountain.id} longitude={fountain.lng} latitude={fountain.lat}>
            <Icon as={MapPinIcon} w={9} h={9} color={i === selectedFountain ? `${PRIMARY_COLOR}.600` : fountain.isFree ? 'blue.600' : 'green.600'} />
          </Marker>
        ))}

        {newFountainLocation !== null && 
          <Marker longitude={newFountainLocation.lng} latitude={newFountainLocation.lat}>
            <Icon as={MapPinIcon} w={9} h={9} color='red.600' />
          </Marker>
        }

        <GeolocateControl onGeolocate={() => setIsGeolocating(false)} ref={geoControlRef} style={{ display: 'none' }} />
      </Map>

      <MapHeader handleGeolocate={handleGeolocate} isGeolocating={isGeolocating} handleSetMapStyle={handleSetMapStyle} isAddingFountain={isAddingFountain} mapStyle={mapStyle} onSelectLocation={onSelectLocation} selectedFountain={selectedFountain} setIsAddingFountain={setIsAddingFountain}  />
    
      {(data && selectedFountain !== -1) && 
        <FountainCard {...data[selectedFountain]} />
      }

      <AddFountainDrawer isOpen={isOpen} onClose={handleOnClose} newFountainLocation={newFountainLocation!} />
    </>
  );
}

export default Home;  