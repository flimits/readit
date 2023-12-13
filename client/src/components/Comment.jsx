import PropTypes from "prop-types";
import { Modal } from "bootstrap";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { EDIT_COMMENT, ADD_REACTION_TO_COMMENT, DELETE_COMMENT } from "../utils/mutations";
import moment from "moment";
import Alert from "./Alert";

const Comments = (props) => {
  const ALERT_TEXT = "You must be logged in to react for this comment";
  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{1F5D1}";

  const commentInstance = props.comment;
  const postInstance = props.post;

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

  useEffect(() => {
    // if (errorReaction) console.log("errorReaction:", errorReaction)
    // if (dataReaction) console.log("dataReaction:", dataReaction)
  }, [errorReaction, dataReaction]);

  if (!commentInstance) return "No Comments for this post yet";

  let editDeleteEnabled = false;

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

  const handleOnClickReaction = async (e) => {
    e.preventDefault();

    if (!Auth.loggedIn()) {

      const modalDiv = document.querySelector(".alert-modal");
      // console.log("modal:", modalDiv);
      const alertModal = modalDiv.querySelector("#alertModal")
      const bootstrapModal = new Modal(alertModal);
      bootstrapModal.show();
      // const alertModal = document.querySelector("#alertModal")
      // console.log("alertModal:", alertModal)
      // const bootstrapModal = new Modal(alertModal);
      // bootstrapModal.show();
      return;
    }

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

  const handleCancelClick = () => {
    setEditedText(commentInstance.text);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const updatedComment = await editComment({
        variables: {
          postId: postInstance._id,
          commentId: commentInstance._id,
          newText: editedText,
        },
      });
      // window.location.reload();
      // console.log(updatedComment);
      // setUpdateComment(updatedComment);
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
    <div className="post-container container">
      <div className="alert-modal"><Alert alert={ALERT_TEXT} centered={true} /></div>

      <div className="card mb-3 custom-comment-card">
        <div className="card-body text-left">
          <div className="card-text row">
            <div className="col-10">{commentInstance.author.userName}</div>
            <div className="col-2">
              {editDeleteEnabled ? (
                <>
                  {isEditing ? (
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={handleCancelClick}
                    >
                      {"\u{2716}"}
                    </a>
                  ) : (
                    <a style={{ cursor: "pointer" }} onClick={handleEditClick}>
                      {emojiCodePoint}
                    </a>
                  )}
                  {isDeleting ? (
                    <a className="link " onClick={handleCancelClick}>
                      {"\u{2716}"}
                    </a>
                  ) : (
                    <a className="link " onClick={handleDeleteClick}>
                      {deleteIcon}
                    </a>
                  )}
                </>
              ) : (
                " "
              )}
            </div>
          </div>
          <div className="card-text">
            <div className="col-8">
              {" "}
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
          </div>
          <div className="card-text row">
            <div className="d-inline-flex fs-5 col-1">
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
          </div>
          <p className="card-text d-flex justify-content-end">
            <small className="text-muted">
              Created on:{" "}
              {moment(`${commentInstance.createdAt}`).format("MMMM Do YYYY")}
            </small>
          </p>
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
