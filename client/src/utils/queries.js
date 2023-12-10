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
query SearchPosts($query: String!, $filterTitle: Boolean, $filterContent: Boolean, $filterTags: Boolean) {
  searchPosts(query: $query, filterTitle: $filterTitle, filterContent: $filterContent, filterTags: $filterTags) {
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