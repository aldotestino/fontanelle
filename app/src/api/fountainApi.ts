import { client } from '.';
import { AddFountainResponse, AddFountainSchema, GetFountainResponse } from '../utils/types';

class FountainApi {
  static endpoint = '/fountain';

  static async addFountain(values: AddFountainSchema): Promise<AddFountainResponse> {
    const { data } = await client.post(`${FountainApi.endpoint}`, values, {
      withCredentials: true
    });
    return data;
  }

  static async getFountains(): Promise<GetFountainResponse[]> {
    const { data } = await client.get(`${FountainApi.endpoint}`);
    return data;
  }

}

export default FountainApi;