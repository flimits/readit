// Import the `useParams()` hook
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ADD_COMMENT } from "../utils/mutations";

import Post from "../components/Post";
import Comment from "../components/Comment";

import { SINGLE_POST } from "../utils/queries";

const MyPosts = () => {
  const { postId } = useParams();

  const [formState, setFormState] = useState({ postId: postId, text: "" });
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
      console.log(data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const { loading, data } = useQuery(SINGLE_POST, {
    // pass url params
    variables: { postId: postId },
  });

  if (loading) return "Loading...";

  // Check if 'post' and 'comments' exist before accessing 'length'
  const post = data?.getPost || {};
  const comments = post.comments || [];

  return (
    <div>
      Viewing single post !!
      <Post post={post} />
      <div>
        <button
          type="button"
          className="btn btn-light"
          data-bs-toggle="collapse"
          data-bs-target="#collapsAddComment"
          aria-expanded="false"
          aria-controls="collapsAddComment"
        >
          Add A Comment
        </button>
      </div>
      <div className="collapse" id="collapsAddComment">
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
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        {comments.length === 0 && "No Comments on this post yet"}
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
