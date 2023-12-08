// import gql from @apollo/client
import { gql } from '@apollo/client';

// Use the gql function to access the thoughts entrypoint and export it
export const QUERY_THOUGHTS = gql`
  query getThoughts {
    thoughts {
      _id
      thoughtText
      thoughtAuthor
      createdAt
    }
  }
`;


export const SEARCH_POSTS = gql`
query SearchPosts($query: String!, $useTitle: Boolean, $useText: Boolean, $useTags: Boolean) {
  searchPosts(query: $query, useTitle: $useTitle, useText: $useText, useTags: $useTags) {
    _id
    userId
    title
    postText
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