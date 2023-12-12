import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { EDIT_COMMENT, ADD_REACTION } from "../utils/mutations";

const Comments = (props) => {
  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{1F5D1}";

  const commentInstance = props.comment;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(commentInstance.text);

  // mutation to edit a post
  const [editComment] = useMutation(EDIT_COMMENT);
  const [toggleReaction] = useMutation(ADD_REACTION, {
    variables: {
      postId: commentInstance._id,
      applause: true,
    },
  });

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
    // See if the user has reacted to this post
    const reaction = commentInstance.reactions.filter(
      (reaction) => reaction.author === Auth.getProfile()?.data?._id
    );
    // console.log("postInstance.reactions:", reaction);

    // If user has reacted, don't apply the class, otherwise apply the class
    if (reaction[0]) return "";
    return "handclap-unclicked";
  };

  const handleOnClickReaction = async (e) => {
    e.preventDefault();

    if (!Auth.loggedIn()) {
      alert("You must be logged in to react to this post");
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

    console.log(commentInstance._id);

    try {
      await editComment({
        variables: {
          commentId: commentInstance._id,
          newText: editedText,
        },
      });
    } catch (error) {
      console.log("Error Editing: ", error);
    }
    setIsEditing(false);
  };

  return (
    <div className="post-container container">
      <div className="card mb-3">
        <div className="card-body text-left">
          <div className="card-text row">
            <div className="col-2">{commentInstance.author.userName}</div>
            <div className="col-2">
              {editDeleteEnabled ? (
                <>
                  {isEditing ? (
                    <a href="#" onClick={handleCancelClick}>
                      {"\u{2716}"}
                    </a>
                  ) : (
                    <a onClick={handleEditClick} href="#">
                      {emojiCodePoint}
                    </a>
                  )}
                  <Link>{deleteIcon}</Link>
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
            <div className="col-1">
              {"\u{1F44F}"}
              {commentInstance?.reactions.length}
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              Created on: {commentInstance.createdAt}
            </small>
          </p>
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
