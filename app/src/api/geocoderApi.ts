import axios from 'axios';
import { Location, SearchOption } from '../utils/types';

class GeocoderApi {

  static async fromCoordinates(location: Location) {
    const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`);
    return data;
  }

  static async fromAddress(address: string) {
    const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.features.map((f: any) => ({
      label: f.place_name,
      lat: f.center[1],
      lng: f.center[0],
      placeType: f.place_type[0]
    })) as SearchOption[];
  }
}

export default GeocoderApi;