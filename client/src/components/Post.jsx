import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import Tag from "./Tag";
import { DELETE_POST, EDIT_POST, ADD_REACTION } from "../utils/mutations";
import { GET_POSTS, GET_ME, SEARCH_POSTS } from "../utils/queries";
import moment from "moment";

const Post = (props) => {
  const emojiCodePoint = "\u{1F4DD}";
  const deleteIcon = "\u{1F5D1}";

  // const [postInstance, setPostInstance] = useState(props?.post);
  const postInstance = props.post;

  const currentPage = useLocation().pathname;
  //Dont make title clickable, if they are already on view post page.
  const disableTitleLink = currentPage.includes("/view-post/");

  //Tracks if user is editing a post
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(postInstance?.title);
  const [editedText, setEditedText] = useState(postInstance?.postText);
  const [editedTags, setEditedTags] = useState('');

  // mutation to edit a post
  const [editPost, { error: editError, data: editData }] =
    useMutation(EDIT_POST);

  const [toggleReaction, { error: reactionError, data: reactionData }] =
    useMutation(ADD_REACTION, {
      variables: {
        postId: postInstance._id,
        applause: true,
      },
    });

  useEffect(() => {
    if (reactionError) console.log("reactionError:", reactionError);
    if (reactionData) console.log("reactionData:", reactionData);
  }, [reactionError, reactionData]);

  useEffect(() => {
    if (isEditing) {
      // Convert the array of tags to a string 
      setEditedTags(postInstance?.tags.join(" "))
    }
  }, [isEditing])

  // mutation to Delete a post
  const [deletePost, { error: deleteError, data: deleteData }] = useMutation(
    DELETE_POST,
    {
      refetchQueries: [GET_POSTS, "getPosts", GET_ME, "getMe", SEARCH_POSTS, "SearchPosts" ],
    }
  );

  //Tracks if user is deleting a post
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reactionError) console.log("reactionError:", reactionError);
    if (reactionData) console.log("reactionData:", reactionData);
    if (reactionData) console.log("deleteData:", deleteData);
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
      return split
    } else {
      return []
    }
  }

  // Checks if the user has reacted or not
  const didUserReact = () => {
    if (!Auth.loggedIn() || postInstance?.reactions?.length === 0) {
      return "handclap-unclicked";
    }
    // See if the user has reacted to this post
    const reaction = postInstance?.reactions?.filter(
      (reaction) => reaction.author === Auth.getProfile()?.data?._id
    );
    // console.log("postInstance.reactions:", reaction);

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

  const handleTagChange = (e) => {
    setEditedTags(e.target.value);
  }

  const handleCancelClick = () => {
    setEditedTitle(postInstance?.title);
    setEditedText(postInstance?.postText);
    setEditedTags(postInstance?.tags);
    setIsEditing(false);
    setIsDeleting(false);
  };

  const handleEditClick = () => {
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
          newTags: tagsArray
        },
      });
      // set the current post to the received edited post
      // setPostInstance(editedPost?.data?.editPost);
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
    <div className="post-container container">
      <div className="card my-3 custom-post-card">
        <div className="card-body text-left">
          <div className="card-text row">
            <div className="col-10 fs-5">
              {isEditing ? (
                <>
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
            <div className="col-2 fs-4">
              {editDeleteEnabled ? (
                <>
                  {isEditing ? (
                    <a className="link " onClick={handleCancelClick}>
                      {"\u{2716}"}
                    </a>
                  ) : (
                    <a onClick={handleEditClick} className="link ">
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
            <div className="col-12">
              {isEditing ? (
                <>
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
                <input
                  type="text"
                  name="title"
                  className="form-control me-2"
                  placeholder="e.g. cooking football vacation"
                  value={editedTags}
                  onChange={handleTagChange}
                />
              </>
            ) : null
            }
          </div>
          {isEditing ?
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-secondary w-100 my-1"
            >
              Save 💾
            </button> : null
          }
          <div className="card-text row">
            <div className="d-inline-flex fs-5 col-1">
              <div className="handclap-full me-2">
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
            <div className="col-1 fs-5">
              {"\u{1F4AC}"}
              {postInstance?.comments?.length}
            </div>
            {/* Hide tags when editing a post */}
            {!isEditing ?
              <div className="col-8 fs-5">Tags: {postInstance.tags.map((tag, index) => {
                return <Tag key={index} tag={tag} />
              })}
              </div>
              : null
            }
          </div>
          <p className="card-text d-flex justify-content-end">
            <small className="text-muted">
              <b>{postInstance?.author?.userName}</b> on:{" "}
              {moment(`${postInstance?.createdAt}`).format("MMMM Do YYYY")}
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
