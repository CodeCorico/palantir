import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.bitbucket.org/2.0',
  withCredentials: false,
});
