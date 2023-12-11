// Import the `useParams()` hook
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ADD_COMMENT } from "../utils/mutations";
import Auth from "../utils/auth";

import Post from "../components/Post";
import Comment from "../components/Comment";

import { SINGLE_POST } from "../utils/queries";

const ViewPost = () => {
  const { postId } = useParams();

  try {
    if (Auth.loggedIn()) { // Only try this if the user is logged in
      const loggedUser = Auth.getProfile();
      // console.log(loggedUser);
    }
  } catch (error) {
    console.log("Authorization error !!", error);
  }

  const [formState, setFormState] = useState({
    // author: loggedUser,
    postId: postId,
    text: "",
  });
  const [addComment, { error, commentData }] = useMutation(ADD_COMMENT);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addComment({
        variables: { ...formState },
      });
      // console.log(data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const { loading, data } = useQuery(SINGLE_POST, {
    //pass url params
    variables: { postId: postId },
  });

  if (loading) return "Loading...";
  const post = data?.getPost || {};
  return (
    <div>
      {/* Viewing single post !! */}
      <Post post={post} />
      <div>
        {Auth.loggedIn() && (
          <button
            type="button"
            className="btn btn-light mb-3"
            data-bs-toggle="collapse"
            data-bs-target="#collapsAddComment"
            aria-expanded="false"
            aria-controls="collapsAddComment"
          >
            Add A Comment
          </button>
        )}
      </div>
      <div className="collapse mb-3" id="collapsAddComment">
        <div className="card card-body">
          <form className="comment-form" onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="new-comment" className="form-label">
                Write Comment
              </label>
              <textarea
                id="new-comment"
                className="form-control"
                required
                name="text"
                value={formState.text}
                onChange={handleChange}
                rows="3"
              ></textarea>
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        {post?.comments.length === 0 && "No Comments on this post yet"}
        {post?.comments.map((comments) => (
          <Comment key={comments._id} comment={comments} />
        ))}
      </div>
    </div>
  );
};

export default ViewPost;
