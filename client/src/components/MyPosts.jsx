import Post from "../components/Post";
import { GET_POSTS } from "../utils/queries";

import { useQuery } from "@apollo/client";

const MyPosts = () => {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return "Loading ...";
  if (error) return `Error ! ${error.message}`;

  return (
    <main className="container">
      <div className="flex-row justify-center">
        <div className="col-12 mb-3">
          {data?.posts.map((item) => (
            <Post post={item} key={item._id} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyPosts;