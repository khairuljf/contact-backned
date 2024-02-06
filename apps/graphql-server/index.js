import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';

import { typeDefs } from './schema.js';

const resolvers = {
  Query: {
    contacts: async (parent, { id }) => {
      const response = await axios.get(`http://localhost:3006/contacts`);
      const contacts = response.data;
      return contacts;
    },

    contact: async (parent, { id }) => {
      const response = await axios.get(`http://localhost:3006/contacts/${id}`);
      const ContactData = response.data;

      return {
        id: ContactData.id,
        name: ContactData.name,
        email: ContactData.email,
      };
    },
  },

  Mutation: {
    addContact: async (_, args) => {
      let contact = {
        ...args.contact,
        id: Math.floor(Math.random() * 1000).toString(),
      };

      try {
        const response = await axios.post(
          'http://localhost:3006/contacts',
          contact
        );

        if (response.data) {
          return contact;
        }
      } catch (error) {
        // Handle errors from the API call
        console.error('Error while making the API call:', error);
        return error;
      }
    },

    updateContact: async (_, args) => {
      let contact = {
        ...args.edits,
      };
      try {
        const response = await axios.put(
          `http://localhost:3006/contacts/${args?.id}`,
          contact
        );

        return response?.data;
      } catch (error) {
        // Handle errors from the API call
        console.error('Error while making the API call:', error);
        return error;
      }
    },

    deleteContact: async (_, args) => {
      try {
        const response = await axios.delete(
          `http://localhost:3006/contacts/${args?.id}`
        );

        if (response.data) {
          const response = await axios.get(`http://localhost:3006/contacts`);
          return response.data;
        }
      } catch (error) {
        // Handle errors from the API call
        console.error('Error while making the API call:', error);
        return error;
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`🚀  Server ready at: ${url}`);
