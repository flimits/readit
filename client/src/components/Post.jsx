import PropTypes from "prop-types";
import { Modal } from "bootstrap/dist/js/bootstrap.min.js";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import Tag from "./Tag";
import { DELETE_POST, EDIT_POST, ADD_REACTION } from "../utils/mutations";
import { GET_POSTS, GET_ME, SEARCH_POSTS, SINGLE_POST } from "../utils/queries";
import moment from "moment";
import Alert from "./Alert";
import "./Post.css";

const Post = (props) => {
  const ALERT_TEXT = "You must be logged in to react to this post";
  const postInstance = props.post;

  //use current page to determine the current page the user is on.
  const currentPage = useLocation().pathname;
  //Dont make title clickable, if they are already on view post page.
  const disableTitleLink = currentPage.includes("/view-post/");

  //Tracks if user is editing a post
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(postInstance?.title);
  const [editedText, setEditedText] = useState(postInstance?.postText);
  const [editedTags, setEditedTags] = useState("");

  // mutation to edit a post
  const [editPost, { error: editError, data: editData }] =
    useMutation(EDIT_POST);

  //mutation to handle reactions to a post
  const [toggleReaction, { error: reactionError, data: reactionData }] =
    useMutation(ADD_REACTION, {
      variables: {
        postId: postInstance._id,
        applause: true,
      },
    });

  useEffect(() => {
    if (isEditing) {
      // Convert the array of tags to a string
      setEditedTags(postInstance?.tags.join(" "));
    }
  }, [isEditing]);

  // mutation to Delete a post and refetch queries
  const [deletePost, { error: deleteError, data: deleteData }] = useMutation(
    DELETE_POST,
    {
      refetchQueries: [
        GET_POSTS,
        "getPosts",
        GET_ME,
        "getMe",
        SEARCH_POSTS,
        "SearchPosts",
        SINGLE_POST,
        "getSinglePost",
      ],
    }
  );

  //Tracks if user is deleting a post
  const [isDeleting, setIsDeleting] = useState(false);

  //update state when we react, edit or delete posts
  useEffect(() => {
    // if (reactionError) console.log("reactionError:", reactionError);
    // if (reactionData) console.log("reactionData:", reactionData);
    // if (reactionData) console.log("deleteData:", deleteData);
  }, [
    reactionError,
    reactionData,
    editError,
    editData,
    deleteData,
    deleteError,
  ]);

  //if no post instance do nothing
  if (!postInstance) return <></>;

  //handles displaying edit and delete actions
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

  /**
   * Takes the user's input and separates it by whitespace to create an array
   * @returns An array of the split up tags or empty
   */
  const convertTagsToArray = () => {
    if (editedTags) {
      const split = editedTags.split(" ");
      return split;
    } else {
      return [];
    }
  };

  // Checks if the user has reacted or not
  const didUserReact = () => {
    if (!Auth.loggedIn() || postInstance?.reactions?.length === 0) {
      return "handclap-unclicked";
    }
    // See if the user has reacted to this post
    const reaction = postInstance?.reactions?.filter(
      (reaction) => reaction.author === Auth.getProfile()?.data?._id
    );
    // If user has reacted, don't apply the class, otherwise apply the class
    if (reaction && reaction[0]) return "";
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
      const modalDiv = document.querySelector(".alert-modal-post");
      const alertModal = modalDiv.querySelector("#alertModal");
      const bootstrapModal = new Modal(alertModal);
      bootstrapModal.show();
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

  const handleTagChange = (e) => {
    //update tags
    setEditedTags(e.target.value);
  };

  // change states when user cancels it
  const handleCancelClick = () => {
    setEditedTitle(postInstance?.title);
    setEditedText(postInstance?.postText);
    setEditedTags(postInstance?.tags);
    setIsEditing(false);
    setIsDeleting(false);
  };

  const handleEditClick = () => {
    // tracks when the user clicks on the edit action icon
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const tagsArray = convertTagsToArray();

    try {
      await editPost({
        variables: {
          postId: postInstance._id,
          newTitle: editedTitle,
          newText: editedText,
          newTags: tagsArray,
        },
      });
    } catch (error) {
      console.log("Error Editing: ", error);
    }
    setIsEditing(false);
  };

  //delete a post !!
  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleDelete = async () => {
    try {
      await deletePost({
        variables: { postId: postInstance?._id },
      });
    } catch (error) {
      console.log("Error deleting Post !!", error);
    }
    setIsDeleting(false);
  };

  return (
    <div className="post-container">
      <div className="alert-modal-post" style={{ zIndex: 9999 }}>
        <Alert alert={ALERT_TEXT} centered={true} />
      </div>
      <div className="card my-3 custom-post-card">
        <div className="card-body text-left">
          <div className="card-text row">
            <div className="col-10 fs-5 main-title">
              {isEditing ? (
                <>
                  <span className="edit-label">Title</span>
                  <input
                    type="text"
                    name="title"
                    className="form-control me-2"
                    placeholder="New Title"
                    value={editedTitle}
                    onChange={handleTitleChange}
                  />
                </>
              ) : (
                <>
                  {disableTitleLink ? (
                    postInstance?.title
                  ) : (
                    <Link to={`view-post/${postInstance?._id}`}>
                      {postInstance?.title}
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="col-2 fs-4 d-flex justify-content-end">
              {editDeleteEnabled ? (
                <>
                  {isEditing ? (
                    <a className="link " onClick={handleCancelClick}>
                      <i className="fa-regular fa-rectangle-xmark"></i>
                    </a>
                  ) : (
                    <a onClick={handleEditClick} className="link edit-icon">
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
          <div className="card-text">
            <div className="col-12 main-text">
              {isEditing ? (
                <>
                  <span className="edit-label">Text</span>
                  <textarea
                    name="postText"
                    className="form-control my-1 mb-10"
                    placeholder="Post Message"
                    value={editedText}
                    onChange={handlePostTextChange}
                  />
                </>
              ) : (
                <>{postInstance?.postText}</>
              )}
            </div>
          </div>
          <div className="col-12 fs-5">
            {isEditing ? (
              <>
                <span className="edit-label">Tags</span>
                <input
                  type="text"
                  name="title"
                  className="form-control me-2"
                  placeholder="e.g. cooking football vacation"
                  value={editedTags}
                  onChange={handleTagChange}
                />
              </>
            ) : null}
          </div>
          {isEditing ? (
            <>
              {/* Validate post title and text cant be empty */}
              {(editedTitle.trim() === "" || editedText.trim() === "") && (
                <div className="post-edit-error">
                  Post Title or Text can not be empty !
                </div>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={editedTitle.trim() === "" || editedText.trim() === ""}
                className="btn btn-secondary w-100 my-1"
              >
                Save <i className="fa-solid fa-floppy-disk"></i>
              </button>
            </>
          ) : null}
          <div className="card-text row">
            <div className="d-inline-flex fs-5 col-sm-2 nowrap p-0">
              <div className="handclap-full">
                <button
                  id="button-post-reaction"
                  className="border-0 button-post-reaction"
                  onClick={(e) => handleOnClickReaction(e)}
                >
                  <span className={didUserReact()}>{"\u{1F44F}"}</span>
                </button>
              </div>
              {postInstance?.reactions?.length}
            </div>
            <div className="col-2 fs-5 comment-icon nowrap">
              <i className="fa-regular fa-message"></i>
              <span>{postInstance?.comments?.length}</span>
            </div>
            {/* Hide tags when editing a post */}
            {!isEditing ? (
              <div className="col-8 fs-5 tag-container">
                Tags:{" "}
                {postInstance.tags.map((tag, index) => {
                  return <Tag key={index} tag={tag} />;
                })}
              </div>
            ) : null}
          </div>
          <p className="card-text d-flex justify-content-end">
            <small className="text-muted">
              {postInstance?.author?.userName} posted on:{" "}
              {moment(`${postInstance?.createdAt}`).format("MMMM Do YYYY")}
            </small>
          </p>
          {isDeleting ? (
            <>
              <div className="delete-post-mask">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="btn btn-secondary"
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
