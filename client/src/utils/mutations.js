import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      token
      user {
        _id
        userName
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($userName: String!, $email: String!, $password: String!) {
    addUser(userName: $userName, email: $email, password: $password) {
      token
      user {
        _id
        userName
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost($title: String!, $postText: String!, $tags: [String]) {
    addPost(title: $title, postText: $postText, tags: $tags) {
      _id
      title
      author {
        _id
        userName
      }
      postText
      tags
    }
  }
`;

export const EDIT_POST = gql`
  mutation editPost($postId: ID!, $newTitle: String, $newText: String, $newTags: [String]) {
    editPost(postId: $postId, newTitle: $newTitle, newText: $newText, newTags: $newTags) {
      _id
      title
      author {
        _id
        userName
      }
      postText
      tags
      reactions {
        _id
        author
        applause
      }
      createdAt
      comments {
        _id
        author {
          userName
        }
        text
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($postId: ID!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      _id
      author {
        _id
        userName
      }
      comments {
        _id
        author {
          userName
        }
        text
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      _id
      title
      postText
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation editComment($postId: ID!, $commentId: ID!, $newText: String!) {
    editComment(postId: $postId, commentId: $commentId, newText: $newText) {
      _id
      author {
        _id
        userName
      }
      comments {
        _id
        author {
          userName
        }
        text
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation AddReactionToPost($postId: ID!, $applause: Boolean!) {
    addReactionToPost(postId: $postId, applause: $applause) {
      _id
      reactions {
        _id
        author
        applause
      }
    }
  }
`;


export const ADD_REACTION_TO_COMMENT = gql`
mutation AddReactionToComment($postId: ID!, $commentId: ID!, $applause: Boolean!) {
  addReactionToComment(postId: $postId, commentId: $commentId, applause: $applause) {
    _id
    title
    postText
    tags
    author {
      _id
      userName
    }
    comments {
      _id
      text
      author {
        _id
        userName
      }
      createdAt
      reactions {
        _id
        author
        applause
      }
    }
    reactions {
      _id
      author
      applause
    }
    createdAt
  }
}
`;