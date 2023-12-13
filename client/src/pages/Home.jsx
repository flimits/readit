import Post from "../components/Post";
import { GET_POSTS } from "../utils/queries";

import { useQuery } from "@apollo/client";

import Alert from "../components/Alert";

const Home = () => {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return "Loading ...";
  if (error) return `Error ! ${error.message}`;

  // Lets sort the posts by createdAt in descending order
  const sortedPosts = data?.posts.slice().sort((a, b) => {
    // you can change the sort direction with '>' to '<' for ascending order
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <main className="container">
      <div className="flex-row justify-center">
        <div className="col-12 my-3">
          {sortedPosts.map((item) => (
            <Post post={item} key={item._id} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
