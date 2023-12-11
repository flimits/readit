import Post from "./Post";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import Auth from "../utils/auth";


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
            <Post post={item} key={item._id} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyProfile;