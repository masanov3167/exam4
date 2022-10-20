const { gql } = require('apollo-server-express')

module.exports = gql`
    type Complex {
        id: ID!
        name: String!
        address: String!
        room: Int!
        roomkv: Int!
        roomkvsum: Int!
        companyid: Int!
    }

   extend  type Query {
        complex:  [Complex]!
    }
    extend type Mutation {
        getComplex(id:ID!): [Complex]!
        getOneComplex(id:ID!):[Complex]!
        delComplex(id: ID): String!
        postComplex(name:String, address:String, room: Int, roomkv: Int, roomkvsum: Int, companyid: Int): String!
        putComplex(name:String, address:String, room: Int, roomkv: Int, roomkvsum: Int, companyid: Int, id: ID!): String!
    }
`