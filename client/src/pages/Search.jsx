import { useEffect, useState } from "react"
import { useLazyQuery } from '@apollo/client';
import { SEARCH_POSTS } from '../utils/queries'

export default function Search() {
  const [searchPosts, { data }] = useLazyQuery(SEARCH_POSTS);

  const [posts, setPosts] = useState([])
  const [finalQuery, setFinalQuery] = useState(''); // Used for showing what the user searched for
  const [searchQuery, setSearch] = useState('');
  const [searchTitle, setTitle] = useState(true);
  const [searchText, setText] = useState(true);
  const [searchTags, setTags] = useState(true);

  useEffect(() => {
    if (data) setPosts([...data.searchPosts])
  }, [data])

  useEffect(() => {
    console.log("posts:", posts)
  }, [posts])

  const handleOnChange = (event) => {
    setSearch(event.target.value);
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    // console.log("query:", searchQuery)
    setFinalQuery(searchQuery);
    try {
      await searchPosts({
        variables: {
          query: searchQuery,
          useTitle: searchTitle,
          useText: searchText,
          useTags: searchTags,
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Determines what to show the user. 
   * If there are posts, found then show the posts.
   * If there are no posts found with a query, show the user there's no posts,
   * else, render nothing
   * @returns React code with the appropriate information to show
   */
  const renderSearch = () => {
    if (posts.length > 0) {
      return (
        <div>
          <h2>Search results for: {finalQuery}</h2>
          {posts.map((post, index) => {
            // TODO: Put in Post component here when finished
            return (
              <div key={index}>
                <p>{post.title}</p>
                <p>{post.postText}</p>
                <p>Tags: {post.tags}</p>
                <p>Applause: {post.applauseCount}</p>
                <br />
              </div>
            )
          })}
        </div>
      )
    } else if (posts.length == 0 && finalQuery) {
      return (
        <div>
          <h2>No posts found for: {finalQuery}</h2>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <section>
      <div className="d-flex  justify-content-center mt-3">
        <form className="w-75" role="search" onSubmit={handleOnSubmit}>
          <label htmlFor="searchInput" className="form-label fs-3">What do you want to search for?</label>

          <div className="input-group">
            <input
              id="searchInput"
              className="form-control me-2"
              value={searchQuery}
              onChange={handleOnChange}
              type="search"
              placeholder="e.g. baking golf programming"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </div>
        </form>
      </div>

      <hr />
      <div>
        {renderSearch()}
      </div>
    </section>
  )
}