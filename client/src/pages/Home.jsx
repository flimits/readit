import Post from "../components/Post";
import { GET_POSTS } from "../utils/queries";
import { useQuery } from "@apollo/client";

const Home = () => {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return "Loading ...";
  if (error) return `Error ! ${error.message}`;

  // sort the posts by total comments and reactions
  const sortedPosts = data?.posts?.sort((a, b) => {
    return (
      b?.reactions?.length +
      b?.comments?.length -
      (a?.reactions?.length + a?.comments?.length)
    );
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
