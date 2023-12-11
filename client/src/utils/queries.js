// import gql from @apollo/client
import { gql } from "@apollo/client";

// Use the gql function to access the thoughts entrypoint and export it
export const GET_POSTS = gql`
  query getPosts {
    posts {
      _id
      title
      postText
      author {
        userName
        _id
      }
      createdAt
      comments {
        _id
        author {
          userName
        }
        text
      }
      reactions {
        _id
        author
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
      postText
      author {
        _id
        userName
      }
      createdAt
      comments {
        _id
        author {
          _id
          userName
        }
        text
        reactions {
          applause
        }
        createdAt
      }
      reactions {
        _id
        author
        applause
      }
      tags
    }
  }
`;

export const SEARCH_POSTS = gql`
  query SearchPosts(
    $query: String!
    $filterTitle: Boolean
    $filterContent: Boolean
    $filterTags: Boolean
  ) {
    searchPosts(
      query: $query
      filterTitle: $filterTitle
      filterContent: $filterContent
      filterTags: $filterTags
    ) {
      _id
      title
      postText
      author {
        _id
        userName
      }
      createdAt
      tags
      reactions {
        _id
        applause
        author {
          _id
        }
      }
      comments {
        text
      }
    }
  }
`;
