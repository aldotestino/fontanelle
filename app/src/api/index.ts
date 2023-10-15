import axios from 'axios';
import { QueryClient } from 'react-query';

const client = (() => {
  return axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.1.52:3000/api/v1' : ''
  });
})();

const queryClient = new QueryClient();

export { client, queryClient };