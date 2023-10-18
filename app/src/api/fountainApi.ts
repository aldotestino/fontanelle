import { client } from '.';
import { AddFountainSchema } from '../utils/types';

class FountainApi {
  static endpoint = '/fountain';

  static async addFountain(values: AddFountainSchema) {
    const { data } = await client.post(`${FountainApi.endpoint}`, values, {
      withCredentials: true
    });
    return data;
  }

}

export default FountainApi;