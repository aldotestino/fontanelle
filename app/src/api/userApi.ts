import { client } from '.';
import { SigninSchema, SignupSchema } from '../utils/validators';

class UserApi {
  static endpoint = '/user';

  static async signup(values: SignupSchema) {
    const { data } = await client.post(`${UserApi.endpoint}/signup`, values);
    return data;
  }

  static async signin(values: SigninSchema) {
    const { data } = await client.post(`${UserApi.endpoint}/signin`, values, {
      withCredentials: true
    });
    return data;
  }

  static async signout() {
    return client.get(`${UserApi.endpoint}/signout`, {
      withCredentials: true
    });
  }

  static async getSignedUser() {
    const { data } = await client.get(`${UserApi.endpoint}/me`, {
      withCredentials: true
    });
    return data;
  }

}

export default UserApi;