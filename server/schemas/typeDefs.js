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

    addPost(userId: ID!, title: String!, postText: String!, tags: [String]): Post
    editPost(postId: ID!, newTitle: String, newText: String): Post
    deletePost(postId: ID!): Post

    addComment(postId: ID!, userId: ID!, text: String!): Comment
    addReactionToPost(postId: ID!, userId: ID!, applause: Boolean!): Post
    addReactionToComment(postId: ID!, commentId: ID!, userId: ID!, applause: Boolean!): Post

    editTagsFromPost(postId: ID!, newTags: [String]!): Post
}

`;

module.exports = typeDefs;
