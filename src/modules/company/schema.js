const { gql } = require('apollo-server-express')

module.exports = gql`
    type Company {
        id: ID!
        name: String!
        img: String!
    }

   extend  type Query {
        company:  [Company]!
    }
    extend type Mutation {
        delCompany(id: ID): String!
        getCompany(id:ID!): [Company]!
    }
`