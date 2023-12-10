// import gql from @apollo/client
import { gql } from '@apollo/client';

// Use the gql function to access the thoughts entrypoint and export it
export const GET_POSTS = gql`
  query getPosts {
    posts {
      _id
      title
      userId
      postText
      createdAt
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

export const SINGLE_POST = gql`
  query getSinglePost($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      userId
      postText
      createdAt
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


export const SEARCH_POSTS = gql`
query SearchPosts($query: String!, $filterTitle: Boolean, $filterContent: Boolean, $filterTags: Boolean) {
  searchPosts(query: $query, filterTitle: $filterTitle, filterContent: $filterContent, filterTags: $filterTags) {
    _id
    userId
    title
    postText
    createdAt
    tags
    reactions {
      applause
    }
    comments {
      text
    }
  }
}
`;