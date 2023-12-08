import React, { useState } from 'react';

export default function CreatePost() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic here
    // For simplicity, we're just updating the state to simulate a submission.
    setSubmitted(true);

    // Redirect back to the page after a 2-second delay
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' }}>
      <div style={{ width: '50%', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        {submitted ? (
          <div>
            <h2>Your post has been submitted</h2>
            {/* You can add additional content or redirect the user as needed */}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" className="form-control" id="title" placeholder="Title" />
            </div>
            <br></br>
            <div className="form-group">
              <textarea className="form-control" id="post-body" rows="3" placeholder="Post Message"></textarea>
            </div>
            <br></br>
            <div className="form-group">
              <input type="text" className="form-control" id="newtag" placeholder="Add Tags" />
            </div>
            <div className="form-group">
              <label htmlFor="tagControlSelect">Tags</label>
              <select className="form-control" id="tagControlSelect">
                <option>tag1</option>
                <option>tag2</option>
                <option>tag3</option>
                <option>tag4</option>
                <option>tag5</option>
              </select>
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
