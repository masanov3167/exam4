const { gql } = require('apollo-server-express')

module.exports = gql`
    scalar mortgage

    type Bank {
        id: ID!
        name: String!
        address: String!
        mortgage: mortgage!
    }

   extend  type Query {
        bank:  [Bank]!
    }
    extend type Mutation {
        delBank(id: ID!): String!
        postBank(name:String, address:String, mortgage: mortgage): String!
        putBank(name:String, address:String, mortgage: mortgage, id: ID!): String!
        findBank(year: Int, sum: Int): [Bank]!
    }
`