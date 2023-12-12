import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import Auth from "../utils/auth";
import Tag from "./Tag";
import { EDIT_POST, ADD_REACTION } from "../utils/mutations";
import moment from "moment";

const Post = (props) => {
  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{1F5D1}";

  const postInstance = props.post;
  // console.log("PostInsance: ", postInstance);

  const currentPage = useLocation().pathname;
  //Dont make title clickable, if they are already on view post page.
  const disableTitleLink = currentPage.includes("/view-post/");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(postInstance.title);
  const [editedText, setEditedText] = useState(postInstance.postText);

  // mutation to edit a post
  const [editPost] = useMutation(EDIT_POST);
  const [toggleReaction] = useMutation(ADD_REACTION, {
    variables: {
      postId: postInstance._id,
      applause: true,
    },
  });

  if (!postInstance?._id) return "No Post to view !!";

  let editDeleteEnabled = false;

  try {
    if (Auth.loggedIn()) {
      // Only try this if the user is logged in
      const loggedUser = Auth.getProfile();
      if (loggedUser?.data?._id === postInstance?.author?._id) {
        editDeleteEnabled = true;
      }
    }
  } catch (error) {
    console.log("Authorization error !!", error);
  }

  // Checks if the user has reacted or not
  const didUserReact = () => {
    if (!Auth.loggedIn() || postInstance.reactions.length === 0) {
      return "handclap-unclicked";
    }
    // See if the user has reacted to this post
    const reaction = postInstance.reactions.filter(
      (reaction) => reaction.author === Auth.getProfile()?.data?._id
    );
    // console.log("postInstance.reactions:", reaction);

    // If user has reacted, don't apply the class, otherwise apply the class
    if (reaction[0]) return "";
    return "handclap-unclicked";
  };

  /**
   * Checks if the user has already reacted to that post and if so, updates the database.
   * If the user has NOT reacted, add the reaction to the post's subdoc of reactions.
   * IF the user HAS reacted, remove the reaction to the post's subdoc of reactions
   * @param {Event} e
   */
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

  const handleTitleChange = (e) => {
    // Update state as the user edits the input
    setEditedTitle(e.target.value);
  };
  const handlePostTextChange = (e) => {
    // Update state as the user edits the input
    setEditedText(e.target.value);
  };

  const handleCancelClick = () => {
    // Reset editedTitle and editedText
    setEditedTitle(postInstance.title);
    setEditedText(postInstance.postText);
    setIsEditing(false);
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await editPost({
        variables: {
          postId: postInstance._id,
          newTitle: editedTitle,
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
            <div className="col-10 fs-5">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="title"
                    className="form-control me-2"
                    value={editedTitle}
                    onChange={handleTitleChange}
                  />
                </>
              ) : (
                <>
                  {disableTitleLink ? (
                    postInstance.title
                  ) : (
                    <Link to={`view-post/${postInstance._id}`}>
                      {postInstance.title}
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="col-2 fs-4">
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
                  <Link>{deleteIcon}</Link>
                </>
              ) : (
                " "
              )}
            </div>
          </div>
          <div className="card-text">
            <div className="col-12">
              {isEditing ? (
                <>
                  <textarea
                    name="postText"
                    className="form-control my-1 mb-10"
                    value={editedText}
                    onChange={handlePostTextChange}
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
                <>{postInstance.postText}</>
              )}
            </div>
          </div>
          <div className="card-text row">
            <div className="d-inline-flex fs-5 col-1">
              <div className="handclap-full me-2">
                <button
                  id="button-post-reaction"
                  className="border-0 bg-white button-post-reaction"
                  onClick={(e) => handleOnClickReaction(e)}
                >
                  <span className={didUserReact()}>{"\u{1F44F}"}</span>
                </button>
              </div>
              {postInstance?.reactions.length}
            </div>
            <div className="col-1 fs-5">
              {"\u{1F4AC}"}
              {postInstance?.comments.length}
            </div>
            <div className="col-8 fs-5">
              Tags:{" "}
              {postInstance.tags.map((tag, index) => {
                return <Tag key={index} tag={tag} />;
              })}
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              <b>{postInstance.author.userName}</b> on:{" "}
              {moment(`${postInstance.createdAt}`).format("MMMM Do YYYY")}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.any,
    title: PropTypes.string,
    author: PropTypes.any,
    postText: PropTypes.string,
    reactions: PropTypes.array,
    comments: PropTypes.array,
    tags: PropTypes.array,
    createdAt: PropTypes.any,
  }),
};

export default Post;
