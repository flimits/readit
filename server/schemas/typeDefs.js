const typeDefs = `
type User {
    _id: ID
    userName: String
    email: String
    password: String
    posts:[Post]
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

type Comment {
    _id: ID
    userId: ID
    text: String
    reactions: [Reaction]
}

type Reaction {
    _id: ID
    userId: ID
    applause: Boolean
}


type Query {
    users: [User]!
    getUser(userId: ID!): User

    posts: [Post]!
    getPost(postId: ID!): Post
}

type Mutation {
    addUser(userName: String!, email: String!, password: String!): User

    addPost(userId: ID!, title: String!, postText: String!, tags: [String]): Post
    editPost(postId: ID!, newTitle: String, newText: String): Post

    addComment(postId: ID!, userId: ID!, text: String!): Comment
    addReactionToPost(postId: ID!, userId: ID!, applause: Boolean!): Reaction
    addReactionToComment(postId: ID!, commentId: ID!, userId: ID!, applause: Boolean!): Reaction
}

`;

module.exports = typeDefs;
