import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://rajbeer.tech',
});

export default axiosClient;