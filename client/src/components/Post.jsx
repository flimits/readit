import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import Tag from "./Tag";
import { EDIT_POST } from "../utils/mutations";

const Post = (props) => {

  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{1F5D1}";

  const postInstance = props.post;
  console.log("PostInsance: ", postInstance);

  const currentPage = useLocation().pathname;
  //Dont make title clickable, if they are already on view post page.
  const disableTitleLink = currentPage.includes("/view-post/");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(postInstance.title);
  const [editedText, setEditedText] = useState(postInstance.postText);

  // mutation to edit a post
  const [editPost] = useMutation(EDIT_POST);

  if (!postInstance?._id) return "No Post to view !!";

  let editDeleteEnabled = false;

  try {
    if (Auth.loggedIn()) { // Only try this if the user is logged in
      const loggedUser = Auth.getProfile();
      if (loggedUser?.data?._id === postInstance?.author?._id) {
        editDeleteEnabled = true;
      }
    }

  } catch (error) {
    console.log("Authorization error !!", error);
  }

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
                    <a href="#"  onClick={handleCancelClick}>
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
            <div className="col-12">
              {isEditing ? (
                <>
                  <textarea
                    name="postText"
                    className="form-control my-1 mb-10"
                    value={editedText}
                    onChange={handlePostTextChange}
                  />
                  <button type="button" onClick={handleSave} className="btn btn-secondary w-100 my-1">
                    Save  💾
                  </button>
                </>
              ) : (
                <>{postInstance.postText}</>
              )}
            </div>
          </div>
          <div className="card-text row">
            <div className="col-1">
              {"\u{1F44F}"}
              {postInstance?.reactions.length}
            </div>
            <div className="col-1">
              {"\u{1F4AC}"}
              {postInstance?.comments.length}
            </div>
            <div className="col-8">Tags: {postInstance.tags.map((tag, index) => {
                return <Tag key={index} tag={tag} />
            })}
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
            <b>{postInstance.author.userName}</b> on: {postInstance.createdAt}
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
