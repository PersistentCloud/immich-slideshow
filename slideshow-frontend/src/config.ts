// src/config.ts
import axios from 'axios';
import { Config } from './global/interfaces';

const PROXY_URL = process.env.REACT_APP_PROXY_URL ? process.env.REACT_APP_PROXY_URL : "";


const loadConfig = async () => {
  return await axios.get(`${PROXY_URL}/config`).then((response) => {
    const config: Config = response.data;
    config.IMMICH_API_BASE_URL = PROXY_URL;
    return config;
  }).catch((error) => {
    throw new Error('Failed to load configuration: ', error);
  });
};

let config: any;

const initializeConfig = async (): Promise<Config> => {
  if (!config) {
    config = await loadConfig();
  }
  return config;
};

export default initializeConfig;