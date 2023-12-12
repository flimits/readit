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

  return (
    <main className="container">
      <div className="flex-row justify-center">
        <div className="col-12 mb-3">
          {data?.getMe?.posts.map((item) => (
            <Post post={item}
              key={item._id}
              username={item?.author?.userName}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyProfile;