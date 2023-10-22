import axios from 'axios';
import { QueryClient } from 'react-query';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});

const queryClient = new QueryClient();

export { client, queryClient };