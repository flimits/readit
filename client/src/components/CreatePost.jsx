import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../utils/mutations";
import Auth from "../utils/auth";
import "../App.css";

export default function CreatePost() {
  // Use state to perform hot updates of updating state, starting with resetting state to a default.
  const [submitted, setSubmitted] = useState(false);
  const [isPostValid, setPostValid] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [tags, setTags] = useState([]);
  const [tagString, setTagString] = useState("");
  // The meat of the app,
  const [addPost, { error, data }] = useMutation(ADD_POST);

  // Checks if the title and postText are filled out to see if Create Post button is enabled or not
  useEffect(() => {
    if (title && postText) {
      setPostValid(true);
    } else {
      setPostValid(false);
    }
  }, [title, postText, tags]);

  // Determines if the Create Post button is enabled or disabled
  useEffect(() => {
    const buttonCreate = document.getElementById("button-create-post");

    // Check if the button is rendered before editing it
    if (buttonCreate) {
      buttonCreate.disabled = !isPostValid;
    }
  }, [isPostValid]);

  // If the post was added to the db, then redirect the user back to the main page
  useEffect(() => {
    if (data && isPostValid) {
      setSubmitted(true); // show the post was submitted
      setTimeout(() => {
        window.location.href = "/my-profile";
      }, 1200);
    }
  }, [data]);

  // Update the "tags" variable by splitting the "tagString" by whitespace to get an array of tags.
  useEffect(() => {
    if (tagString) {
      const split = tagString.split(" ");
      setTags(split);
    } else {
      setTags([]);
    }
  }, [tagString]);

  // Update the title with what the user is typing
  const handleOnChangeTitle = async (event) => {
    event.preventDefault();

    setTitle(event.target.value);
  };

  // Update the post text with what the user is typing
  const handleOnChangePostText = async (event) => {
    event.preventDefault();

    setPostText(event.target.value);
  };

  // Update the tags with what the user is typing
  const handleOnChangeTags = async (event) => {
    event.preventDefault();

    setTagString(event.target.value);
  };

  // This is the submission of the post, making sure all fields are set and then executing the addPost mutation.
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {

      // Prevent the user from adding a post if no title or text
      if (!title || !postText) {
        setPostValid(false);
        return;
      }

      // Filter out any empty spaces in tags array
      const filteredTags = tags.filter((tag) => tag.length > 0);

      await addPost({
        variables: { title, postText, tags: filteredTags },
      });

      // this is to reset the modal state after submitting
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };
  // This renderPostForm will only get executed if a user is logged in (authenticated), as seen at the bottom of this page.
  const renderPostForm = () => {
    return (
      <div
        id="staticBackdropCreatePost"
        className={`modal ${showModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? "block" : "none" }}
      >
        {/* this modal is a popup instead of a page, but only after authentication */}
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {submitted ? (
              <div>
                {/* execute the submission of the page and popup a times notification */}
                <h2 className="text-center p-3">Submitting post</h2>  
              </div>
            ) : (
              <>
              {/* After each section for title, message and tags, run the "handleOnXXXX" to render the page using useState */}
                <div className="modal-header">
                  <h5 className="modal-title">Create Post</h5>
                  <i
                    className="fa-solid fa-square-xmark fa-xl"
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                  ></i>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label htmlFor="title" className="fs-3 mb-1">
                        Title:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="Title"
                        value={title}
                        onChange={handleOnChangeTitle}
                        name="title"
                      />
                    </div>
                    <br></br>
                    <div className="form-group">
                      <label htmlFor="post-text" className="fs-3 mb-1">
                        Text:
                      </label>
                      <textarea
                        className="form-control"
                        id="post-text"
                        rows="4"
                        placeholder="Post Message"
                        value={postText}
                        onChange={handleOnChangePostText}
                        name="postText"
                      />
                    </div>
                    <br></br>
                    <div className="form-group">
                      <label htmlFor="new-tag" className="fs-3">
                        Tags (optional):
                      </label>
                      <p className="mb-2">
                        Separate tags with a space in between
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        id="new-tag"
                        placeholder="e.g. cooking football vacation"
                        value={tagString}
                        onChange={handleOnChangeTags}
                        name="tagString"
                      />
                    </div>
                    <br></br>
                    <button
                      id="button-create-post"
                      type="submit"
                      className="btn btn-primary button-submit"
                      disabled
                    >
                      Create Post
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
// You are either logged in and can post or not
  return <>{Auth.loggedIn() ? renderPostForm() : null}</>;
}
