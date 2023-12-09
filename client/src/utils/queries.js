// import gql from @apollo/client
import { gql } from '@apollo/client';

// Use the gql function to access the thoughts entrypoint and export it
export const QUERY_THOUGHTS = gql`
  query getPosts {
    posts {
      _id
      title
      userId
      postText
      comments {
        _id
        userId
        text
      }
      reactions {
        _id
        userId
        applause
      }
      tags
    }
  }
`;

export const QUERY_SINGLE_POST = gql`
  query getSinglePost($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      userId
      postText
      comments {
        _id
        userId
        text
      }
      reactions {
        _id
        userId
        applause
      }
      tags
    }
  }
`;