import { client } from '.';
import { AddFountainResponse, AddFountainSchema, GetFountainResponse, GetUserFountainResponse, VoteFountainResponse } from '../utils/types';

class FountainApi {
  static endpoint = '/fountain';

  static async addFountain(values: AddFountainSchema): Promise<AddFountainResponse> {
    const { data } = await client.post(`${FountainApi.endpoint}`, values, {
      withCredentials: true
    });
    return data;
  }

  static async voteFountain(values: { fountainId: number, stars: number }): Promise<VoteFountainResponse> {
    const { data } = await client.post(`${FountainApi.endpoint}/vote?fountainId=${values.fountainId}`, {
      stars: values.stars
    }, {
      withCredentials: true
    });
    return data;
  }

  static async getFountains(): Promise<GetFountainResponse[]> {
    const { data } = await client.get(`${FountainApi.endpoint}`);
    return data;
  }

  static async getUserFountains(): Promise<GetUserFountainResponse[]> {
    const { data } = await client.get(`${FountainApi.endpoint}/mine`, {
      withCredentials: true
    });
    return data;
  }

}

export default FountainApi;