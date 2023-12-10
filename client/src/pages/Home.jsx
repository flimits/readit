import Post from "../components/Post";
import { QUERY_THOUGHTS } from "../utils/queries";

import { useQuery } from "@apollo/client";

const Home = () => {
  const { data, loading, error } = useQuery(QUERY_THOUGHTS);

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

export default Home;
