import Post from "../components/Post";
import { GET_POSTS } from "../utils/queries";
import { useQuery } from "@apollo/client";

const Home = () => {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return "Loading ...";
  if (error) return `Error ! ${error.message}`;

  const sortedPosts = data?.posts;

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
