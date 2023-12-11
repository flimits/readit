import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_POST } from '../utils/mutations';

import "../App.css";

export default function CreatePost() {
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [tags, setTags] = useState([]);
  const [tagString, setTagString] = useState('');

  const [addPost, { error, data }] = useMutation(ADD_POST);

  // If the post was added to the db, then redirect the user back to the main page
  useEffect(() => {
    if (data) {
      setSubmitted(true); // show the post was submitted
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [data])

  // Update the "tags" variable by splitting the "tagString" by whitespace to get an array of tags.
  useEffect(() => {
    if (tagString) {
      const split = tagString.split(" ");
      console.log("split:", split);
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
      
      await addPost({
        variables: { title, postText, tags },
      });

    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className='createpost-form'>
      <div className='createpost-boxinform'>
        {submitted ? (
          <div>
            <h2>Your post has been submitted! Redirecting back to home page...</h2>
          </div>
        ) : (
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
              <label htmlFor='new-tag' className='fs-3'>Tags:</label>
              <p className='mb-2'>(Separate tags with a space in between)</p>
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
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
