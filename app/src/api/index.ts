import axios from 'axios';
import { QueryClient } from 'react-query';

const client = (() => {
  return axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1' : ''
  });
})();

const queryClient = new QueryClient();

export { client, queryClient };