// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Post from "../components/Post";

import { QUERY_SINGLE_POST } from "../utils/queries";

const ViewPost = () => {
  const { postId } = useParams();
  //console.log("View post with params: ", postId);
  const { loading, data } = useQuery(QUERY_SINGLE_POST, {
    //pass url params
    variables: { postId: postId },
  });

  if (loading) return "Loading...";

  console.log("View post with params: ", data?.getPost);

  const post = data?.getPost || {};

  return (
    <div>
      Viewing single post !!
      <Post post={post} />
    </div>
  );
};

export default ViewPost;
