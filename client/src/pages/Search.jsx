import { useEffect, useState } from "react"
import { useLazyQuery, useQuery } from '@apollo/client';
import { SEARCH_POSTS } from '../utils/queries'

export default function Search() {
  const [searchPosts, { data }] = useLazyQuery(SEARCH_POSTS);

  const [searchQuery, setSearch] = useState('');
  const [searchTitle, setTitle] = useState(true);
  const [searchText, setText] = useState(true);
  const [searchTags, setTags] = useState(true);

  useEffect(() => {
    if (data) {
      console.log("posts:", data);
    }
  }, [data]);

  const handleOnChange = (event) => {
    setSearch(event.target.value);
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    console.log("query:", searchQuery)

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

  return (
    <section className="d-flex justify-content-center mt-3">
      <form className="w-75" role="search" onSubmit={handleOnSubmit}>
        <label htmlFor="searchInput" className="form-label pull-end">What do you want to search for?</label>

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
    </section>
  )
}