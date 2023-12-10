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
  mutation addPost($title: String!, $postText: String!) {
    addPost(title: $title, postText: $postText) {
      _id
      title
      author { 
        _id
        userName
      }
      postText 
    }
  }
`;