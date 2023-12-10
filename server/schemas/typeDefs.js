const typeDefs = `
scalar Date

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
    author: User
    postText: String
    createdAt: Date
    comments: [Comment]
    tags: [String]
    reactions: [Reaction]
}

type Comment {
    _id: ID
    author: User
    text: String
    reactions: [Reaction]
    createdAt: Date
}

type Reaction {
    _id: ID
    author: ID
    applause: Boolean
}

type Auth {
    token: ID!
    user: User
}

type Query {
    users: [User]!
    getUser(userId: ID!): User
    getMe: User

    posts: [Post]!
    getPost(postId: ID!): Post
    searchPosts(query: String!, filterTitle: Boolean, filterContent: Boolean, filterTags: Boolean): [Post]
}

type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    login(userName: String!, password: String!): Auth

    addPost(title: String!, postText: String!): Post
    editPost(postId: ID!, newTitle: String, newText: String): Post
    deletePost(postId: ID!): Post

    addComment(postId: ID!, text: String!): Comment
    addReactionToPost(postId: ID!, applause: Boolean!): Post
    addReactionToComment(postId: ID!, commentId: ID!, applause: Boolean!): Post

    editTagsFromPost(postId: ID!, newTags: [String]!): Post
}

`;

module.exports = typeDefs;
