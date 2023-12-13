import PropTypes from "prop-types";
import { Modal } from "bootstrap/dist/js/bootstrap.min.js";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import {
  EDIT_COMMENT,
  ADD_REACTION_TO_COMMENT,
  DELETE_COMMENT,
} from "../utils/mutations";
import moment from "moment";
import Alert from "./Alert";

import "./Post.css";

//Defining Comment functions with props passed in
const Comments = (props) => {
  // Bring up alert to notify user must be logged in to react to a comment
  const ALERT_TEXT = "You must be logged in to react to this comment";

  const commentInstance = props.comment;
  const postInstance = props.post;

  // Set stateful values that will be used for editing a comment
  const [isEditing, setIsEditing] = useState(false);
  // const [updateComment, setUpdateComment] = useState({});
  const [editedText, setEditedText] = useState(commentInstance.text);

  // mutation to edit a comment for a post
  const [editComment] = useMutation(EDIT_COMMENT);
  const [toggleReaction, { error: errorReaction, data: dataReaction }] =
    useMutation(ADD_REACTION_TO_COMMENT, {
      variables: {
        postId: postInstance._id,
        commentId: commentInstance._id,
        applause: true,
      },
    });

  // mutation to delete a comment
  const [deleteComment] = useMutation(DELETE_COMMENT);

  //Tracks if user is deleting a comment
  const [isDeleting, setIsDeleting] = useState(false);

  // using use effect to rerender component when statefull values change
  useEffect(() => {}, [errorReaction, dataReaction]);

  if (!commentInstance) return "No Comments for this post yet";

  // setting value to delete comment to false
  let editDeleteEnabled = false;

  // Checking to see if user is logged in
  try {
    if (Auth.loggedIn()) {
      const loggedUser = Auth.getProfile();

      if (loggedUser?.data?._id === commentInstance?.author?._id) {
        editDeleteEnabled = true;
      }
    }
  } catch (error) {
    console.log("Authorization error !!", error);
  }

  // Checks to see if user has reacted
  const didUserReact = () => {
    if (!Auth.loggedIn() || commentInstance.reactions.length === 0) {
      return "handclap-unclicked";
    }
    // See if the user has reacted to this comment
    const reaction = commentInstance.reactions.filter(
      (reaction) => reaction.author === Auth.getProfile()?.data?._id
    );
    // console.log("reactions:", reaction);

    // If user has reacted, don't apply the class, otherwise apply the class
    return reaction[0] ? "" : "handclap-unclicked";
  };

  // This handles the logic for when a user clicks the reaction icon
  const handleOnClickReaction = async (e) => {
    e.preventDefault();

    // User must be logged in to react
    if (!Auth.loggedIn()) {
      const modalDiv = document.querySelector(".alert-modal-comment");
      const alertModal = modalDiv.querySelector("#alertModal");
      const bootstrapModal = new Modal(alertModal);
      bootstrapModal.show();
      return;
    }

    // If user is authenticated we call the toggle reaction
    try {
      await toggleReaction();
    } catch (error) {
      console.log("couldn't handle reaction");
      console.error(error);
    }
  };

  const handleCommentTextChange = (e) => {
    // Update state as the user edits the input
    setEditedText(e.target.value);
  };

  // when a user cancels editing or deleting a post values reset to previous state
  const handleCancelClick = () => {
    setEditedText(commentInstance.text);
    setIsEditing(false);
    setIsDeleting(false);
  };

  // Toggle the isEditing value
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Once user submits changes this will handle the changes
  const handleSave = async (e) => {
    e.preventDefault();

    // Use editComment mutation to update the comment
    try {
      const updatedComment = await editComment({
        variables: {
          postId: postInstance._id,
          commentId: commentInstance._id,
          newText: editedText,
        },
      });
    } catch (error) {
      console.log("Error Editing: ", error);
    }
    setIsEditing(false);
  };

  // Delete a comment!
  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  // execute the deletion and reset setisdeleted to false
  const handleDelete = async () => {
    try {
      // Call the deleteComment mutation
      await deleteComment({
        variables: { postId: postInstance._id, commentId: commentInstance._id },
      });
    } catch (error) {
      console.log("Error deleting a Comment!!", error);
    } finally {
      // Reset the deleting state
      setIsDeleting(false);
    }
  };

  return (
    <div className="comment-container">
      <div className="alert-modal-comment">
        <Alert alert={ALERT_TEXT} centered={true} />
      </div>

      <div className="card mb-1 custom-comment-card">
        <div className="card-body text-left">
          <div className="card-text row">
            <div className="col-10">
              {" "}
              {/*if isEditing a true then we show the text area otherwise we show the text*/}
              {isEditing ? (
                <>
                  <textarea
                    name="postText"
                    className="form-control my-1 mb-10"
                    value={editedText}
                    onChange={handleCommentTextChange}
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn btn-secondary w-100 my-1"
                  >
                    Save 💾
                  </button>
                </>
              ) : (
                <>{commentInstance.text}</>
              )}
            </div>
            <div className="col-2 fs-4 comment-icons d-flex justify-content-end">
              {editDeleteEnabled ? (
                <>
                  {isEditing ? (
                    <a className="link" onClick={handleCancelClick}>
                      <i className="fa-regular fa-rectangle-xmark"></i>
                    </a>
                  ) : (
                    <a className="link" onClick={handleEditClick}>
                      <i className="fa-solid fa-pen"></i>
                    </a>
                  )}
                  {isDeleting ? (
                    <a className="link " onClick={handleCancelClick}>
                      <i className="fa-regular fa-rectangle-xmark"></i>
                    </a>
                  ) : (
                    <a className="link " onClick={handleDeleteClick}>
                      <i className="fa-solid fa-trash-can"></i>
                    </a>
                  )}
                </>
              ) : (
                " "
              )}
            </div>
          </div>
          <div className="card-text row">
            <div className="d-inline-flex fs-5 col-2">
              <div className="handclap-full me-2">
                <button
                  id="button-comment-reaction"
                  className="border-0 "
                  onClick={(e) => handleOnClickReaction(e)}
                >
                  <span className={didUserReact()}>{"\u{1F44F}"}</span>
                </button>
              </div>
              {commentInstance?.reactions.length}
            </div>
            <div className="d-inline-flex col-10 justify-content-end align-items-center">
              <p className="card-text d-flex ">
                <small className="text-muted">
                  {commentInstance?.author?.userName}
                  {"  "}
                  commented on:{" "}
                  {moment(`${commentInstance.createdAt}`).format(
                    "MMMM Do YYYY"
                  )}
                </small>
              </p>
            </div>
          </div>

          {isDeleting ? (
            <>
              <div className="delete-post-mask">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-primary"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="btn btn-primary"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

// setting prop validation
Comments.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.any,
    text: PropTypes.string,
    reactions: PropTypes.array,
    createdAt: PropTypes.any,
  }),
};

export default Comments;
