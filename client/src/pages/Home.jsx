import Post from "../components/Post";
import { GET_POSTS } from "../utils/queries";

import { useQuery } from "@apollo/client";

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
        <div className="col-12 mb-3">
          {sortedPosts.map((item) => (
            <Post
              post={item}
              key={item._id}
              username={item?.author?.userName}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
