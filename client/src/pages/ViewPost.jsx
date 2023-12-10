// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Post from "../components/Post";

import { SINGLE_POST } from "../utils/queries";

const ViewPost = () => {
  const { postId } = useParams();
  const { loading, data } = useQuery(SINGLE_POST, {
    //pass url params
    variables: { postId: postId },
  });

  if (loading) return "Loading...";
  const post = data?.getPost || {};

  return (
    <div>
      Viewing single post !!
      <Post post={post} />
    </div>
  );
};

export default ViewPost;
