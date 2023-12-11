import { useEffect, useState } from "react"
import { useLazyQuery } from '@apollo/client';
import { SEARCH_POSTS } from '../utils/queries'
import Post from "../components/Post";
import { useLocation } from "react-router-dom";

export default function Search() {
  const [searchPosts, { data }] = useLazyQuery(SEARCH_POSTS);

  const [posts, setPosts] = useState([])
  const [finalQuery, setFinalQuery] = useState(''); // Used for showing what the user searched for
  const [searchQuery, setSearch] = useState('');
  const [filterTitle, setFilterTitle] = useState(true);
  const [filterContent, setFilterContent] = useState(true);
  const [filterTags, setFilterTags] = useState(true);
  
  // TODO? Somehow check when the webpage changes address?
  // Get any thing from the address bar that has a "?"
  const addressBarQuery = useState(useLocation().search)
  const CHECKBOX_IDS = {
    TITLE: "search-filter-title",
    CONTENT: "search-filter-content",
    TAGS: "search-filter-tags",
  }

  // console.log("location:", useLocation())

  useEffect(() => {
    console.log("data:", data);
    if (data) setPosts([...data.searchPosts])
  }, [data])

  useEffect(() => {
    // console.log("posts:", posts)
  }, [posts])

  useEffect(() => {
    if (finalQuery.length > 0) {
      const doSearch = async () => {
        console.log("@doSearch");
        await searchForPosts(finalQuery);
      }
  
      doSearch();
    }
  }, [finalQuery])

  useEffect(() => {
    console.log("addressBarQuery:", addressBarQuery)
  }, [addressBarQuery])

  // Initialize the filter checkboxes to true once after rendering
  useEffect(() => {
    document.getElementById(CHECKBOX_IDS.TITLE).checked = filterTitle
    document.getElementById(CHECKBOX_IDS.CONTENT).checked = filterContent
    document.getElementById(CHECKBOX_IDS.TAGS).checked = filterTags

    // Check if there's a ? in the address bar. Meaning it's redirected from a tag, so we do a search instantly 
    if (addressBarQuery[0]) {
      console.log("addressBarQuery:", addressBarQuery);
      const query = addressBarQuery[0].split("=").pop();
      setSearch(query);
      setFinalQuery(query);
    }
  }, [])

  const searchForPosts = async (query) => {
    console.log("@searchForPosts");
    console.log("searchQuery:", searchQuery)

    try {
      await searchPosts({
        variables: {
          query,
          filterTitle,
          filterContent,
          filterTags,
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  const handleOnChangeSearch = (event) => {
    setSearch(event.target.value);
  }

  /**
   * Updates the state variables to match the checkbox's `.checked` values
   * @param {Object} target Deconstructed from "event"
   */
  const handleOnChangeFilter = ({ target }) => {
    // console.log("event.target:", target)

    switch (target.id) {
      case CHECKBOX_IDS.TITLE:
        setFilterTitle(target.checked)
        break;
      case CHECKBOX_IDS.CONTENT:
        setFilterContent(target.checked)
        break;
      case CHECKBOX_IDS.TAGS:
        setFilterTags(target.checked)
        break;
    }
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    // console.log("query:", searchQuery)
    setFinalQuery(searchQuery);
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
            return <Post key={index} post={post} />
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
          <p>(Separate keywords by spaces)</p>
          <div className="input-group">
            <input
              id="searchInput"
              className="form-control me-2"
              value={searchQuery}
              onChange={handleOnChangeSearch}
              type="search"
              placeholder="e.g. baking golf programming"
              aria-label="Search"
            />

            <div className="dropdown me-2">
              <button type="button" className="btn btn-primary dropdown-toggle rounded-0" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                Filters
              </button>
              <div className="dropdown-menu p-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${CHECKBOX_IDS.TITLE}`}
                    onChange={(e) => handleOnChangeFilter(e)}
                  />
                  <label className="form-check-label" htmlFor={`${CHECKBOX_IDS.TITLE}`}>
                    Titles
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${CHECKBOX_IDS.CONTENT}`}
                    onChange={(e) => handleOnChangeFilter(e)}
                  />
                  <label className="form-check-label" htmlFor={`${CHECKBOX_IDS.CONTENT}`}>
                    Content
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${CHECKBOX_IDS.TAGS}`}
                    onChange={(e) => handleOnChangeFilter(e)}
                  />
                  <label className="form-check-label" htmlFor={`${CHECKBOX_IDS.TAGS}`}>
                    Tags
                  </label>
                </div>
              </div>
            </div>

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