// src/config.ts
const loadConfig = async () => {
  const response = await fetch('/config.json');
  if (!response.ok) {
    throw new Error('Failed to load configuration');
  }
  return await response.json();
};

let config: any;

const initializeConfig = async () => {
  if (!config) {
    config = await loadConfig();
  }
  return config;
};

export default initializeConfig;