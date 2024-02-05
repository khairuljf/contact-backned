import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';




import {typeDefs } from './schema.js'



const resolvers = {
    Query:{

        contacts: async (parent, {id}) => {
            const response = await axios.get(`http://localhost:3006/contacts`)
            const contacts = response.data;
            return contacts
        },
        
        contact: async (parent, {id}) => {
            const response = await axios.get(`http://localhost:3006/contacts/${id}`)
            const ContactData = response.data;

            return {
                id: ContactData.id,
                name: ContactData.name,
                email: ContactData.email,
               
            }
        },

    

    },

    Mutation :{

        deleteContact(_, args){
            return db.games.map((game)=>game.id !== args.id)
        },

        addContact(_, args){

            let game = {
                ...args.game,
                id:Math.floor(Math.random() * 1000).toString()
            }

            db.games.push(game)

            return game

        },

        updateContact(_, agrs){

            db.games = db.games.map((g)=>{
                if(g.id===agrs.id){
                    return {...g, ...agrs.edits}
                }
                return g
            })

            return db.games
        }
    }
}


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