import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

const databases = new Databases(client);

const storage = new Storage(client);


client
  .setEndpoint(import.meta.env.VITE_PUBLIC_ENDPOINT)
  .setProject(import.meta.env.VITE_PUBLIC_PROJECT_ID)

const account = new Account(client);

export { client, account, databases, storage };
