import axios from 'axios';

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { Authorization: process.env.NEXT_PUBLIC_API_TOKEN },
});

export default axiosApi;
