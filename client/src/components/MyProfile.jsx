import Post from "./Post";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

// Simply using the getMe query in order to pull back authenticated posts that are the
// users only. (pretty much the same as the homepage only now it is for the users things
// that will be seen here).

const MyProfile = () => {

  const { data, loading, error } = useQuery(GET_ME);

  if (loading) return "Loading ...";
  if (error) return `Error ! ${error.message}`;

  console.log("my data is:", data?.getMe?.posts);

  // Sort the posts by createdAt in descending order
  const sortedPosts = data?.getMe?.posts.slice().sort((a, b) => {
    // Change '>' to '<' for ascending order
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // we simply just need to return all posts.
  // and in ascending order
  return (
    <main className="container">
      <h1>hi</h1>
      <div className="flex-row justify-center">
        <div className="col-12 mb-3">
          {sortedPosts.map((item) => (
            <Post
              post={item}
              key={item._id}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyProfile;