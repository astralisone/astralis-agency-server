// Configuration values for the client
// These values can be overridden by environment variables

interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
};

export default config; 