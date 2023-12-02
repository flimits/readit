const typeDefs = `
type User {
    _id: ID
    userName: String
    email: String
    password: String
}

type Query {
    users: [User]!
}

`;

module.exports = typeDefs;