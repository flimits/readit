import { useEffect, useState } from "react"
import { useLazyQuery } from '@apollo/client';
import { SEARCH_POSTS } from '../utils/queries'
import Post from "../components/Post";
import { useLocation } from "react-router-dom";

export default function Search() {
  const [posts, setPosts] = useState([])
  const [finalQuery, setFinalQuery] = useState(''); // Used for showing what the user searched for
  const [searchQuery, setSearch] = useState('');
  const [filterTitle, setFilterTitle] = useState(true);
  const [filterContent, setFilterContent] = useState(true);
  const [filterTags, setFilterTags] = useState(true);

  // Tracks if address bar changes due to clicking a tag. Initialize to the react hook for this to work
  const [addressBarQuery, setAddressBar] = useState(useLocation().search)

  const [searchPosts, { data }] = useLazyQuery(SEARCH_POSTS, {
    variables: {
      query: finalQuery,
      filterTitle,
      filterContent,
      filterTags,
    }
  });


  const CHECKBOX_IDS = {
    TITLE: "search-filter-title",
    CONTENT: "search-filter-content",
    TAGS: "search-filter-tags",
  }

  // Triggers if posts were found in the database. Renders the posts
  useEffect(() => {
    // console.log("data:", data);
    if (data) setPosts([...data.searchPosts])
  }, [data])

  // Triggers when the address bar is updated
  useEffect(() => {
    // Check if there's a ? in the address bar. Meaning it's redirected from a tag, so we do a search instantly 
    if (addressBarQuery[0] === "?") {
      const query = addressBarQuery.split("=").pop(); // get the query after the = sign
      setSearch(query);
      setFinalQuery(query);
    }
  }, [addressBarQuery])

  // Triggers when clicking on a tag that will update the address bar
  useEffect(() => {
    // Use window.location.search since we can't use useLocation() inside of another hook
    setAddressBar(window.location.search)
  }, [useLocation().search])

  // Triggers whenever finalQuery is changed. This starts searching for posts
  useEffect(() => {
    if (finalQuery.length > 0) { // Checks against whitespace
      const doSearch = async () => {
        try {
          await searchPosts()
        } catch (error) {
          console.error(error);
        }
      }

      doSearch();
    }
  }, [finalQuery])

  // Initialize the filter checkboxes to true once after rendering
  useEffect(() => {
    document.getElementById(CHECKBOX_IDS.TITLE).checked = filterTitle
    document.getElementById(CHECKBOX_IDS.CONTENT).checked = filterContent
    document.getElementById(CHECKBOX_IDS.TAGS).checked = filterTags
  }, [])

  /** 
   * Update the value `searchQuery` to reflect what the user is typing in the search bar 
   */
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

  /**
   * Sets `finalQuery` value which will trigger searching for posts
   * @param {Event} event 
   */
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
      <div className="d-flex row justify-content-center mt-3">
        <div className="text-center">
          <label htmlFor="searchInput" className="form-label fs-3">What do you want to search for?</label>
          <p>(Separate keywords by spaces)</p>
        </div>
        <form className="container-fluid" role="search" onSubmit={handleOnSubmit}>
          <div className="row justify-content-center">
            <div className="col-lg-10 p-0 mt-2">
              <input
                id="searchInput"
                className="form-control"
                value={searchQuery}
                onChange={handleOnChangeSearch}
                type="search"
                placeholder="e.g. baking golf programming"
                aria-label="Search"
              />
            </div>
            <div className="col-lg-1 p-0 m-0">
              <button type="button" className="btn btn-primary dropdown-toggle col-12 me-2 mt-2" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                Filters
              </button>
              <div className="dropdown-menu dropdown-menu-end p-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${CHECKBOX_IDS.TITLE}`}
                    onChange={(e) => handleOnChangeFilter(e)}
                  />
                  <label className="form-check-label fs-lg-3" htmlFor={`${CHECKBOX_IDS.TITLE}`}>
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


            <div className=" col-lg-1 p-0">
              <button className="btn btn-success col-12 mt-2" type="submit">Search</button>

            </div>
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