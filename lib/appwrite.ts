
import { Client, Account } from 'appwrite';
import { config } from './config';
const client = new Client()
  .setEndpoint(config.APPWRITE_ENDPOINT)
  .setProject(config.APPWRITE_PROJECT_ID)

export const account = new Account(client);
export default client;
