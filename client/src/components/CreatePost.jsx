import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_POST } from '../utils/mutations';
import Auth from "../utils/auth";

import "../App.css";

export default function CreatePost() {
  const [submitted, setSubmitted] = useState(false);
  const [isPostValid, setPostValid] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [tags, setTags] = useState([]);
  const [tagString, setTagString] = useState('');

  const [addPost, { error, data }] = useMutation(ADD_POST);

  // Checks if the title and postText are filled out to see if Create Post button is enabled or not
  useEffect(() => {
    if (title && postText) {
      setPostValid(true);
    } else {
      setPostValid(false);
    }
  }, [title, postText, tags])

  // Determines if the Create Post button is enabled or disabled
  useEffect(() => {
    const buttonCreate = document.getElementById('button-create-post')

    // Check if the button is rendered before editing it
    if (buttonCreate) {
      buttonCreate.disabled = !isPostValid
    }
  }, [isPostValid])

  // If the post was added to the db, then redirect the user back to the main page
  useEffect(() => {
    if (data && isPostValid) {
      setSubmitted(true); // show the post was submitted
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }, [data])

  // Update the "tags" variable by splitting the "tagString" by whitespace to get an array of tags.
  useEffect(() => {
    if (tagString) {
      const split = tagString.split(" ");
      setTags(split)
    } else {
      setTags([])
    }
  }, [tagString])

  // Update the title with what the user is typing
  const handleOnChangeTitle = async (event) => {
    event.preventDefault();

    setTitle(event.target.value)
  }

  // Update the post text with what the user is typing
  const handleOnChangePostText = async (event) => {
    event.preventDefault();

    setPostText(event.target.value)
  }

  // Update the tags with what the user is typing
  const handleOnChangeTags = async (event) => {
    event.preventDefault();

    setTagString(event.target.value)
  }


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("FormState U R Posting: ", { title, postText, tags })

      // Prevent the user from adding a post if no title or text
      if (!title || !postText) {
        setPostValid(false);
        return;
      }

      // Filter out any empty spaces in tags array
      const filteredTags = tags.filter((tag) => tag.length > 0)
      console.log("filteredTags:", filteredTags)

      await addPost({
        variables: { title, postText, tags: filteredTags }
      });

      // this is to reset the modal state after submitting
      setShowModal(false);

    } catch (err) {
      console.log(err);
    }
  };


  const renderPostForm = () => {
    return (

          <div
            id="staticBackdropCreatePost"
            className={`modal ${showModal ? 'show' : ''}`}
            tabIndex="-1"
            role="dialog"
            style={{ display: showModal ? 'block' : 'none' }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                {submitted ? (
                  <div>
                    <h2>Your post has been submitted!</h2>
                  </div>
                ) : (
                  <>
                    <div className="modal-header">
                      <h5 className="modal-title">Create Post</h5>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setShowModal(false)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                          <label htmlFor='title' className='fs-3 mb-1'>Title:</label>
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
                          <label htmlFor='post-text' className='fs-3 mb-1'>Text:</label>
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
                          <label htmlFor='new-tag' className='fs-3'>Tags (optional):</label>
                          <p className='mb-2'>Separate tags with a space in between</p>
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
                        <button id='button-create-post' type="submit" className="btn btn-primary" disabled>Create Post</button>
                      </form>
              </div>
            </>
            )}
            </div>
          </div>
          </div>
    )
  }

  return (
    <>
      {Auth.loggedIn() ?
        renderPostForm() :
        <h2 className='text-center fs-1 mt-5'>Please login to create a post</h2>
      }
    </>
  );
}
