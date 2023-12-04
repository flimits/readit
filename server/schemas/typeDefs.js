const typeDefs = `
type User {
    _id: ID
    userName: String
    email: String
    password: String
    posts:[Post]
}

type Comment {
    userId: ID
    text: String
}

type Reaction {
    userId: ID
    applause: Boolean
}

type Post {
    _id: ID
    title: String
    userId: ID
    postText: String
    comments: [Comment]
    tags: [String]
    reactions: [Reaction]
}

type Query {
    users: [User]!
    posts: [Post]!
}

`;

module.exports = typeDefs;
