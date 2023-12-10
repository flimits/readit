import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_POST } from '../utils/mutations';

import "../App.css";

export default function CreatePost() {
  const [submitted, setSubmitted] = useState(false);

  const [formState, setFormState] = useState({
    userId: "",
    title: "",
    postText: "",
  })

  const [addPost, { error, data }] = useMutation(ADD_POST);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // setFormState((prevFormState) => {
    //   if (name === "tags") {
    //     // If the input is for tags, split the value by commas and push to the array
    //     const newTags = value.split(",").map((tag) => tag.trim());
    //     console.log("new tags is? ",newTags)
    //     return {
    //       ...prevFormState,
    //       [name]: newTags,
    //     };
    //   } else {
    //     // For other inputs, simply update the value
    //     return {
    //       ...prevFormState,
    //       [name]: value,
    //     };
    //   }
    // });

    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("FormState U R Posting: ", { ...formState })
      const { data } = await addPost({
        variables: { ...formState },
      });


      console.log("Data saved to DB: ", data);

      if (!data.addPost) {

        setFormState({
          title: "",
          postText: "",
        });


        alert("Did you make a change? Make sure all fields are filled out properly");
        return;
      }
      // Perform form submission logic here
      // Update state upon successful submission.
      setSubmitted(true);


    } catch (err) {
      console.log(err);
    }
    // Redirect back to the page after a 2-second delay
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };


  return (
    <div className='createpost-form'>
      <div className='createpost-boxinform'>
        {submitted ? (
          <div>
            <h2>Your post has been submitted</h2>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Title"
                value={formState.title}
                onChange={handleChange}
                name="title"
              />


            </div>
            <br></br>
            <div className="form-group">
              <textarea
                className="form-control"
                id="post-body"
                rows="3"
                placeholder="Post Message"
                value={formState.postText}
                onChange={handleChange}
                name="postText"
              />

            </div>
            <br></br>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="newtag"
                placeholder="Add Tags"
                value={formState.tag}
                onChange={handleChange}
                name="tags"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
