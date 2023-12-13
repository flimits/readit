// Import the `useParams()` hook
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ADD_COMMENT } from "../utils/mutations";
import Auth from "../utils/auth";

import Post from "../components/Post";
import Comment from "../components/Comment";

import { SINGLE_POST } from "../utils/queries";

const ViewPost = () => {
  const { postId } = useParams();

  try {
    if (Auth.loggedIn()) {
      // Only try this if the user is logged in
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

  const [addedComment, setAddedComment] = useState({});
  const [toggleCommentBtn, setToggleCommentBtn] = useState(false);
  const [addComment, { error, data: commentData }] = useMutation(ADD_COMMENT);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { loading, data: postData } = useQuery(SINGLE_POST, {
    //pass url params
    variables: { postId: postId },
  });

  useEffect(() => {}, [addedComment]);

  useEffect(() => {
    // console.log("commentData:", commentData);
  }, [commentData]);

  useEffect(() => {
    // console.log("postData:", postData);
    if (postData && postData.getPost === null) setIsRedirecting(true);
  }, [postData]);

  useEffect(() => {
    if (isRedirecting) {
      // console.log("going to redirect")
      // Redirect to the /my-profile page to force a refresh of the user's posts
      setInterval(() => {
        window.location.href = "/my-profile";
      }, 1200);
    }
  }, [isRedirecting]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const changeBtn = (value) => {
    setToggleCommentBtn(!value);
    setFormState({
      postId: postId,
      text: "",
    });
  };

  const changeBtnOnSubmit = (value) => {
    if (formState.text) {
      setToggleCommentBtn(!value);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await addComment({
        variables: { ...formState },
      });
      // console.log(data);
      // window.location.reload();
      setAddedComment(commentData);
      setFormState({
        postId: postId,
        text: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return "Loading...";
  const post = postData?.getPost || {};

  const renderPost = () => {
    return post._id ? (
      <div>
        <Post post={post} />
        <div className="d-flex justify-content-end">
          {Auth.loggedIn() && (
            <button
              id="add-comment-btn"
              type="button"
              className="btn btn-light mb-3 border-black"
              data-bs-toggle="collapse"
              data-bs-target="#collapsAddComment"
              onClick={() => changeBtn(toggleCommentBtn)}
              aria-expanded={toggleCommentBtn}
              aria-controls="collapsAddComment"
            >
              {!toggleCommentBtn && <>Add A Comment</>}
              {toggleCommentBtn && <>Cancel</>}
            </button>
          )}
        </div>
        <div
          className="collapse mb-3 custom-comment-collapse"
          id="collapsAddComment"
        >
          <div className="card card-body custom-comment-card-body">
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
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    data-bs-toggle={formState.text ? "collapse" : ""}
                    onClick={() => changeBtnOnSubmit(toggleCommentBtn)}
                    data-bs-target="#collapsAddComment"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div>
          {/* This checks to see if there are any comments */}
          {post?.comments?.length === 0 && "No Comments on this post yet"}
          {/* if there is comments then call the comment component and pass in the props*/}
          {post?.comments?.map((comments) => (
            <Comment key={comments._id} post={post} comment={comments} />
          ))}
        </div>
      </div>
    ) : (
      <div className="text-center m-3">
        <h2>This post doesnt exist</h2>
        <Link to={"/"}>
          <span>
            <h3>Go back Home</h3>
          </span>
        </Link>
      </div>
    );
  };

  return (
    <div>
      {/* Viewing single post !! */}
      {!isRedirecting ? (
        renderPost()
      ) : (
        <h2 className="text-center m-3">
          Post deleted, redirecting to your profile.
        </h2>
      )}
    </div>
  );
};

export default ViewPost;
