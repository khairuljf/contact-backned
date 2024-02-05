export const typeDefs = `#graphql
## from api

    type contact {
        id: ID!
        name: String
        email: String
       
    }


  type Query {
    contacts:[contact]
    contact(id: ID!): contact
  }

   type Mutation{
        addContact(contact:AddContactInput!):contact
        deleteContact(id:ID!):[contact]
        updateContact(id:ID!, edits:AddContactInput!):contact
    }

    input AddContactInput{
        name:String!,
        email:[String]
    }
`