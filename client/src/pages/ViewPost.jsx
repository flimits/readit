// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Post from "../components/Post";
import Comment from "../components/Comment";

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
      <div>
        <button
          type="button"
          className="btn btn-light"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Add A Comment
        </button>
      </div>
      <div className="collapse" id="collapseExample">
        <div className="card card-body">
          Some placeholder content for the collapse component. This panel is
          hidden by default but revealed when the user activates the relevant
          trigger.
        </div>
      </div>
      <div>
        {post.comments.length === 0 && "No Comments on this post yet"}
        {post?.comments.map((comments) => (
          <Comment key={comments._id} comment={comments} />
        ))}
      </div>
    </div>
  );
};

export default ViewPost;
