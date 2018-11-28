/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

const GITHUB_TOKEN = process.env.VUE_APP_GITHUB_TOKEN;

export default axios.create({
  baseURL: 'https://api.github.com',
  withCredentials: false,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});
