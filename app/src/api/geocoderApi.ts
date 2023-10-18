import { client } from '.';
import { Location } from '../utils/types';

class GeocoderApi {

  static async fromCoordinates(location: Location) {
    const { data } = await client.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`);
    return data;
  }

}

export default GeocoderApi;